/**
 * Test Script for Chat Message Limit Feature
 *
 * This script tests the 20 messages per day limit for the chatbot feature.
 * It simulates sending multiple messages and verifies the limit enforcement.
 */
const chai = require("chai");
const chaiHttp = require("chai-http");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const expect = chai.expect;

// Import app server
const server = require("../server");
const { ChatConversation } = require("../models");
const { pool } = require("../config/db");

chai.use(chaiHttp);

describe("Chatbot Message Limit Tests", () => {
  let userToken;
  let testUserId = 999; // Special test user ID
  let sessionId;

  // Set up test user and session before tests
  before(async () => {
    // Create a JWT token for a test user
    userToken = jwt.sign(
      { id: testUserId, name: "Test User", email: "test@example.com" },
      process.env.JWT_SECRET || "test_secret",
      { expiresIn: "1h" }
    );

    sessionId = uuidv4();

    // Clean up any existing test data
    try {
      await pool.query("DELETE FROM chat_conversations WHERE user_id = ?", [
        testUserId,
      ]);
      console.log("Test user messages cleaned up");
    } catch (err) {
      console.error("Error cleaning up:", err);
    }
  });

  // Clean up after tests
  after(async () => {
    try {
      await pool.query("DELETE FROM chat_conversations WHERE user_id = ?", [
        testUserId,
      ]);
      console.log("Test user messages cleaned up");
    } catch (err) {
      console.error("Error cleaning up:", err);
    }
  });

  it("should allow sending messages when under the limit", async () => {
    const response = await chai
      .request(server)
      .post("/api/chatbot")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        message: "Test message under limit",
        session_id: sessionId,
        causes: [], // Empty causes for test
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("reply");
    expect(response.body).to.have.property("remaining_messages");
    expect(response.body.remaining_messages).to.be.lessThan(20);
  });

  it("should show approaching limit warning when messages are running low", async () => {
    // Insert test messages to bring count up to 15 (5 remaining)
    const messagesToInsert = [];
    for (let i = 0; i < 14; i++) {
      // We already sent 1, so 14 more to make 15
      messagesToInsert.push([
        testUserId,
        `Test message ${i}`,
        "Test response",
        sessionId,
        new Date(),
      ]);
    }

    await pool.query(
      `INSERT INTO chat_conversations 
       (user_id, message, response, session_id, created_at) 
       VALUES ?`,
      [messagesToInsert]
    );

    const response = await chai
      .request(server)
      .post("/api/chatbot")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        message: "Another test message",
        session_id: sessionId,
        causes: [],
      });

    expect(response).to.have.status(200);
    expect(response.body).to.have.property("remaining_messages");
    expect(response.body.remaining_messages).to.equal(4); // 20 - 16
    expect(response.body).to.have.property("isApproachingLimit", true);
  });

  it("should block messages when daily limit is reached", async () => {
    // Insert more test messages to hit the limit (20 total)
    const messagesToInsert = [];
    for (let i = 0; i < 4; i++) {
      // 16 existing + 4 new = 20 (limit)
      messagesToInsert.push([
        testUserId,
        `Final message ${i}`,
        "Test response",
        sessionId,
        new Date(),
      ]);
    }

    await pool.query(
      `INSERT INTO chat_conversations 
       (user_id, message, response, session_id, created_at) 
       VALUES ?`,
      [messagesToInsert]
    );

    // Try to send a message over the limit
    const response = await chai
      .request(server)
      .post("/api/chatbot")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        message: "Message over limit",
        session_id: sessionId,
        causes: [],
      });

    expect(response).to.have.status(429); // Too Many Requests
    expect(response.body).to.have.property("limitReached", true);
    expect(response.body).to.have.property("reply");
    expect(response.body.reply).to.include("limit");
  });

  it("should verify the daily count is calculated correctly", async () => {
    // Directly check the count method
    const count = await ChatConversation.getUserDailyCount(testUserId);
    expect(count).to.equal(20);
  });
});
