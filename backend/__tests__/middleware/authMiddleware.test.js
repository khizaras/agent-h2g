const { protect, admin } = require("../../middleware/authMiddleware");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// Mock dependencies
jest.mock("jsonwebtoken");
jest.mock("../../models/User");

describe("Auth Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("protect middleware", () => {
    it("should set req.user if valid token is provided", async () => {
      // Setup request with token
      req.headers.authorization = "Bearer validtoken";

      // Mock token verification
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 1 });
      });

      // Mock user
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        is_admin: false,
      };

      User.findById.mockResolvedValue(mockUser);

      // Call middleware
      await protect(req, res, next);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith(
        "validtoken",
        process.env.JWT_SECRET,
        expect.any(Function)
      );
      expect(User.findById).toHaveBeenCalledWith(1);
      expect(req.user).toEqual(mockUser);
      expect(next).toHaveBeenCalled();
    });

    it("should return 401 if no token is provided", async () => {
      // Call middleware without token
      await protect(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("Not authorized"),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if token is invalid", async () => {
      // Setup request with token
      req.headers.authorization = "Bearer invalidtoken";

      // Mock token verification failure
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      // Call middleware
      await protect(req, res, next);

      // Assertions
      expect(jwt.verify).toHaveBeenCalledWith(
        "invalidtoken",
        process.env.JWT_SECRET,
        expect.any(Function)
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("Not authorized"),
      });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if user not found", async () => {
      // Setup request with token
      req.headers.authorization = "Bearer validtoken";

      // Mock token verification
      jwt.verify.mockImplementation((token, secret, callback) => {
        callback(null, { id: 999 });
      });

      // Mock user not found
      User.findById.mockResolvedValue(null);

      // Call middleware
      await protect(req, res, next);

      // Assertions
      expect(User.findById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("Not authorized"),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("admin middleware", () => {
    it("should call next if user is admin", () => {
      // Setup request with admin user
      req.user = {
        id: 1,
        is_admin: true,
      };

      // Call middleware
      admin(req, res, next);

      // Assertions
      expect(next).toHaveBeenCalled();
    });

    it("should return 403 if user is not admin", () => {
      // Setup request with non-admin user
      req.user = {
        id: 1,
        is_admin: false,
      };

      // Call middleware
      admin(req, res, next);

      // Assertions
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("Not authorized as admin"),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });
});
