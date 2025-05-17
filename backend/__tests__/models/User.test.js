const User = require("../../models/User");
const { pool } = require("../../config/db");

// Mock the database pool to avoid actual database calls
jest.mock("../../config/db", () => ({
  pool: {
    query: jest.fn(),
    getConnection: jest.fn().mockReturnValue({
      query: jest.fn(),
      release: jest.fn(),
    }),
  },
}));

describe("User Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a user by ID", async () => {
      // Mock the query response
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        is_admin: false,
      };

      pool.query.mockResolvedValueOnce([[mockUser]]);

      // Call the method
      const result = await User.findById(1);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users WHERE id = ?"),
        [1]
      );
      expect(result).toEqual(mockUser);
    });

    it("should return null when user not found", async () => {
      // Mock empty response
      pool.query.mockResolvedValueOnce([[]]);

      // Call the method
      const result = await User.findById(999);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users WHERE id = ?"),
        [999]
      );
      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("should find a user by email", async () => {
      // Mock the query response
      const mockUser = {
        id: 1,
        name: "Test User",
        email: "test@example.com",
        is_admin: false,
      };

      pool.query.mockResolvedValueOnce([[mockUser]]);

      // Call the method
      const result = await User.findByEmail("test@example.com");

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("SELECT * FROM users WHERE email = ?"),
        ["test@example.com"]
      );
      expect(result).toEqual(mockUser);
    });
  });

  describe("create", () => {
    it("should create a new user", async () => {
      // Mock the query response
      const mockUser = {
        id: 1,
        name: "New User",
        email: "newuser@example.com",
        is_admin: false,
      };

      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.query.mockResolvedValueOnce([[mockUser]]);

      // Call the method
      const userData = {
        name: "New User",
        email: "newuser@example.com",
        password: "hashedpassword",
      };

      const result = await User.create(userData);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO users"),
        expect.arrayContaining([
          userData.name,
          userData.email,
          userData.password,
        ])
      );
      expect(result).toEqual(mockUser);
    });
  });
});
