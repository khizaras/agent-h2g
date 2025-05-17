const Cause = require("../../models/Cause");
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

describe("Cause Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should find a cause by ID", async () => {
      // Mock the query response
      const mockCause = {
        id: 1,
        title: "Test Cause",
        description: "Test Description",
        location: "Test Location",
        category: "local",
        user_id: 1,
      };

      pool.query.mockResolvedValueOnce([[mockCause]]);

      // Call the method
      const result = await Cause.findById(1);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT c.*, u.name as user_name FROM causes c"
        ),
        [1]
      );
      expect(result).toEqual(mockCause);
    });

    it("should return null when cause not found", async () => {
      // Mock empty response
      pool.query.mockResolvedValueOnce([[]]);

      // Call the method
      const result = await Cause.findById(999);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT c.*, u.name as user_name FROM causes c"
        ),
        [999]
      );
      expect(result).toBeNull();
    });
  });

  describe("getAll", () => {
    it("should get all causes with pagination and filters", async () => {
      // Mock the query responses
      const mockCauses = [
        {
          id: 1,
          title: "Test Cause 1",
          description: "Test Description 1",
          location: "Test Location 1",
          category: "local",
        },
        {
          id: 2,
          title: "Test Cause 2",
          description: "Test Description 2",
          location: "Test Location 2",
          category: "emergency",
        },
      ];

      const mockCount = [{ total: 2 }];

      pool.query.mockResolvedValueOnce([mockCauses]);
      pool.query.mockResolvedValueOnce([mockCount]);

      // Call the method with filters
      const filters = {
        page: 1,
        limit: 10,
        category: "all",
        status: "active",
        search: "",
      };

      const result = await Cause.getAll(filters);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining(
          "SELECT c.*, u.name as user_name FROM causes c"
        ),
        expect.any(Array)
      );
      expect(result).toHaveProperty("causes", mockCauses);
      expect(result).toHaveProperty("pagination");
      expect(result.pagination).toHaveProperty("total", 2);
    });
  });

  describe("create", () => {
    it("should create a new cause", async () => {
      // Mock the query response
      const mockCause = {
        id: 1,
        title: "New Cause",
        description: "New Description",
        location: "New Location",
        category: "local",
        user_id: 1,
      };

      pool.query.mockResolvedValueOnce([{ insertId: 1 }]);
      pool.query.mockResolvedValueOnce([[mockCause]]);

      // Call the method
      const causeData = {
        title: "New Cause",
        description: "New Description",
        location: "New Location",
        category: "local",
        user_id: 1,
      };

      const result = await Cause.create(causeData);

      // Assertions
      expect(pool.query).toHaveBeenCalledWith(
        expect.stringContaining("INSERT INTO causes"),
        expect.any(Array)
      );
      expect(result).toEqual(mockCause);
    });
  });
});
