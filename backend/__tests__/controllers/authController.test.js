const {
  registerUser,
  loginUser,
  getCurrentUser,
} = require("../../controllers/authController");
const User = require("../../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Mock dependencies
jest.mock("../../models/User");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user and return success with token", async () => {
      // Setup request body
      req.body = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      };

      // Mock user functions
      User.findByEmail.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedpassword");

      const newUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        is_admin: false,
      };

      User.create.mockResolvedValue(newUser);
      jwt.sign.mockReturnValue("testtoken");

      // Call the controller method
      await registerUser(req, res);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(User.create).toHaveBeenCalledWith({
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
      });
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        process.env.JWT_SECRET,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          is_admin: false,
          token: "testtoken",
        },
      });
    });

    it("should return error if user already exists", async () => {
      // Setup request body
      req.body = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
      };

      // Mock user exists
      User.findByEmail.mockResolvedValue({
        id: 1,
        email: "existing@example.com",
      });

      // Call the controller method
      await registerUser(req, res);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith("existing@example.com");
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("already exists"),
      });
    });
  });

  describe("loginUser", () => {
    it("should login a user and return token", async () => {
      // Setup request body
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      // Mock user and password
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        password: "hashedpassword",
        is_admin: false,
      };

      User.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("testtoken");

      // Call the controller method
      await loginUser(req, res);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedpassword"
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1 },
        process.env.JWT_SECRET,
        expect.any(Object)
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          is_admin: false,
          token: "testtoken",
        },
      });
    });

    it("should return error for invalid credentials", async () => {
      // Setup request body
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // Mock user but invalid password
      const user = {
        id: 1,
        email: "test@example.com",
        password: "hashedpassword",
      };

      User.findByEmail.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      // Call the controller method
      await loginUser(req, res);

      // Assertions
      expect(User.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "wrongpassword",
        "hashedpassword"
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("Invalid credentials"),
      });
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user data", async () => {
      // Setup authenticated request
      req.user = {
        id: 1,
      };

      // Mock user data
      const user = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        is_admin: false,
      };

      User.findById.mockResolvedValue(user);

      // Call the controller method
      await getCurrentUser(req, res);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        user: {
          id: 1,
          name: "Test User",
          email: "test@example.com",
          is_admin: false,
        },
      });
    });

    it("should return error if user not found", async () => {
      // Setup authenticated request with non-existent user
      req.user = {
        id: 999,
      };

      // Mock user not found
      User.findById.mockResolvedValue(null);

      // Call the controller method
      await getCurrentUser(req, res);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("User not found"),
      });
    });
  });
});
