const asyncHandler = require("express-async-handler");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
const { ChatConversation } = require("../models");

// Maximum number of chats allowed per user per day
const DAILY_CHAT_LIMIT = 20;

// @desc    Send message to chatbot
// @route   POST /api/chatbot
// @access  Private
const sendMessage = asyncHandler(async (req, res) => {
  const { message, causes, session_id } = req.body;
  const userId = req.user.id;

  if (!message) {
    res.status(400);
    throw new Error("Please provide a message");
  }

  // Check if user has reached the daily chat limit
  const dailyCount = await ChatConversation.getUserDailyCount(userId);

  if (dailyCount >= DAILY_CHAT_LIMIT) {
    return res.status(429).json({
      success: false,
      reply:
        "You've reached your daily chat limit (20 messages). Please try again tomorrow or contact support if you need immediate assistance.",
      limitReached: true,
    });
  }

  try {
    // Prepare context from causes data for RAG (Retrieval Augmented Generation)
    let context = "";
    if (causes && causes.length > 0) {
      context = "Here's detailed information about our current causes:\n\n";

      causes.forEach((cause, index) => {
        context += `Cause #${index + 1}: "${cause.title}"\n`;
        context += `Description: ${cause.description}\n`;
        context += `Location: ${cause.location}\n`;
        context += `Category: ${cause.category}\n`;
        context += `Target amount: $${cause.target_amount}\n`;
        context += `Current amount: $${cause.current_amount}\n`;
        context += `Percentage funded: ${Math.round(
          (cause.current_amount / cause.target_amount) * 100
        )}%\n`;
        context += `Status: ${cause.status}\n`;
        context += `Created on: ${new Date(
          cause.created_at
        ).toLocaleDateString()}\n`;
        context += `ID: ${cause.id}\n\n`;
      });
    } else {
      context = "We don't have any active causes at the moment.";
    }

    // Create system prompt to instruct the model for RAG
    const systemPrompt = `You are a helpful assistant for the Hands2gether platform, which connects people in need with those who can help, especially for food assistance causes. Your role is to answer questions about the platform and provide information about the current causes. Be friendly, helpful, and concise.
    
Here's what Hands2gether does:
- Connects people who need food assistance with donors and volunteers
- Enables users to create, view and contribute to various feeding initiatives
- Provides a platform for tracking contributions and impact
- Helps build a supportive network for sharing and contributing to causes
- Allows users to follow causes they care about and receive updates

${context}

When answering questions about causes:
1. Reference the data provided in the context above
2. If someone asks about a specific cause, find it in the context and provide details
3. If asked about details not available in the context, politely explain you only have limited information
4. Do not make up information
5. If asked about making donations or contributing, guide users to the specific cause page by mentioning they can click on the cause to contribute directly
6. Keep your answers concise and user-friendly, about 2-3 sentences when possible
7. If users ask how to create a cause, tell them they need to be registered and can click on "Create Cause" in the navigation
8. If asked how to follow causes, explain they can click the "Follow" button on any cause page

IMPORTANT FORMATTING INSTRUCTIONS:
- Use Markdown formatting in your responses to improve readability
- Use **bold** for emphasis and important points
- Use bullet points (*) or numbered lists (1. 2. 3.) to organize information
- Use ## for section headings when providing detailed information
- Use > for quoting cause descriptions
- When listing causes, use bullet points with the cause name in **bold**
- Use proper spacing between paragraphs

You're an AI assistant focused only on Hands2gether platform features and causes. Don't answer questions unrelated to the platform or charitable giving.`; // Prepare the request for OpenRouter API
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/devstral-small:free", // Use Mistral's free model
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      },
      {
        headers: {
          Authorization: `Bearer ${
            process.env.OPENROUTER_API_KEY || "YOUR_API_KEY_HERE"
          }`,
          "HTTP-Referer": "https://hands2gether.org",
          "X-Title": "Hands2gether Assistant",
          "Content-Type": "application/json",
        },
      }
    ); // Extract the assistant's response
    const botReply = response.data.choices[0].message.content;

    // Generate or use existing session ID
    const sessionId = session_id || uuidv4();

    // Save the conversation to the database
    await ChatConversation.create({
      user_id: userId,
      message: message,
      response: botReply,
      session_id: sessionId,
    });

    // Calculate remaining messages for the day
    const remainingMessages = DAILY_CHAT_LIMIT - (dailyCount + 1);
    const isApproachingLimit = remainingMessages <= 5;

    res.status(200).json({
      success: true,
      reply: botReply,
      session_id: sessionId,
      remaining_messages: remainingMessages,
      isApproachingLimit,
    });
  } catch (error) {
    console.error("Chatbot API Error:", error.response?.data || error.message);

    // Handle different types of errors
    if (error.response?.status === 401) {
      // Authentication error with OpenRouter
      res.status(500).json({
        success: false,
        reply:
          "I'm currently unable to connect to my knowledge source. Please check your API key configuration.",
      });
    } else if (
      error.code === "ECONNABORTED" ||
      error.message.includes("timeout")
    ) {
      // Timeout error
      res.status(504).json({
        success: false,
        reply:
          "I'm taking too long to respond. Please try a shorter or simpler question.",
      });
    } else {
      // Generic error
      res.status(500).json({
        success: false,
        reply:
          "I'm having trouble processing your request right now. Please try again shortly.",
      });
    }
  }
});

// @desc    Get conversations for admin dashboard
// @route   GET /api/chatbot/admin/conversations
// @access  Admin
const getAdminConversations = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user.is_admin) {
    res.status(403);
    throw new Error("Not authorized to access admin resources");
  }

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;

  try {
    const result = await ChatConversation.getAllSessionsWithDetails(
      page,
      limit
    );

    res.status(200).json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500);
    throw new Error("Failed to fetch conversation data");
  }
});

// @desc    Get conversation messages by session ID
// @route   GET /api/chatbot/admin/conversations/:sessionId
// @access  Admin
const getConversationBySessionId = asyncHandler(async (req, res) => {
  // Check if user is admin
  if (!req.user.is_admin) {
    res.status(403);
    throw new Error("Not authorized to access admin resources");
  }

  const { sessionId } = req.params;

  try {
    const messages = await ChatConversation.getSessionMessages(sessionId);

    if (messages.length === 0) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    res.status(200).json({
      success: true,
      sessionId,
      messages,
    });
  } catch (error) {
    console.error(`Error fetching conversation ${sessionId}:`, error);

    // If we already set a status code, use that, otherwise 500
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }

    throw new Error(error.message || "Failed to fetch conversation data");
  }
});

// @desc    Get user's chat history
// @route   GET /api/chatbot/history
// @access  Private
const getUserChatHistory = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    const sessions = await ChatConversation.getUserConversationsBySession(
      userId
    );

    res.status(200).json({
      success: true,
      sessions,
    });
  } catch (error) {
    console.error("Error fetching user chat history:", error);
    res.status(500);
    throw new Error("Failed to fetch chat history");
  }
});

// @desc    Get messages for a specific session
// @route   GET /api/chatbot/history/:sessionId
// @access  Private
const getUserSessionMessages = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { sessionId } = req.params;

  try {
    const messages = await ChatConversation.getSessionMessages(sessionId);

    // Verify this session belongs to the requesting user
    if (messages.length > 0 && messages[0].user_id !== userId) {
      res.status(403);
      throw new Error("Not authorized to access this conversation");
    }

    if (messages.length === 0) {
      res.status(404);
      throw new Error("Conversation not found");
    }

    res.status(200).json({
      success: true,
      sessionId,
      messages,
    });
  } catch (error) {
    console.error(`Error fetching session ${sessionId}:`, error);

    // If we already set a status code, use that, otherwise 500
    if (!res.statusCode || res.statusCode === 200) {
      res.status(500);
    }

    throw new Error(error.message || "Failed to fetch conversation data");
  }
});

module.exports = {
  sendMessage,
  getAdminConversations,
  getConversationBySessionId,
  getUserChatHistory,
  getUserSessionMessages,
};
