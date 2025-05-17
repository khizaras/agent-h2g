const {
  createCause,
  getCauses,
  getCauseById,
  updateCause,
  deleteCause,
  addContribution,
} = require("../../controllers/causeController");
const Cause = require("../../models/Cause");

// Mock dependencies
jest.mock("../../models/Cause");

describe("Cause Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      params: {},
      user: {
        id: 1,
        is_admin: false,
      },
      file: null,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getCauses", () => {
    it("should return all causes with pagination", async () => {
      // Setup mock data
      const mockCauses = [
        { id: 1, title: "Test Cause 1" },
        { id: 2, title: "Test Cause 2" },
      ];

      const mockPagination = {
        total: 2,
        page: 1,
        limit: 10,
        pages: 1,
      };

      Cause.getAll.mockResolvedValue({
        causes: mockCauses,
        pagination: mockPagination,
      });

      // Setup query params
      req.query = {
        page: "1",
        limit: "10",
        category: "all",
        status: "active",
        search: "",
      };

      // Call the controller method
      await getCauses(req, res);

      // Assertions
      expect(Cause.getAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        category: "all",
        status: "active",
        search: "",
        userId: undefined,
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        causes: mockCauses,
        pagination: mockPagination,
      });
    });
  });

  describe("getCauseById", () => {
    it("should return a cause by ID", async () => {
      // Setup mock data
      const mockCause = {
        id: 1,
        title: "Test Cause",
        description: "Test Description",
        user_id: 1,
      };

      Cause.findById.mockResolvedValue(mockCause);

      // Setup request
      req.params.id = "1";
      req.user = { id: 2 }; // Different user for isFollowing check

      // Call the controller method
      await getCauseById(req, res);

      // Assertions
      expect(Cause.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cause: expect.objectContaining({
          id: 1,
          title: "Test Cause",
        }),
      });
    });

    it("should return 404 if cause not found", async () => {
      // Mock cause not found
      Cause.findById.mockResolvedValue(null);

      // Setup request
      req.params.id = "999";

      // Call the controller method
      await getCauseById(req, res);

      // Assertions
      expect(Cause.findById).toHaveBeenCalledWith(999);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("not found"),
      });
    });
  });

  describe("createCause", () => {
    it("should create a new cause", async () => {
      // Setup mock data
      const mockCause = {
        id: 1,
        title: "New Cause",
        description: "New Description",
        location: "Location",
        category: "local",
        user_id: 1,
      };

      Cause.create.mockResolvedValue(mockCause);

      // Setup request
      req.body = {
        title: "New Cause",
        description: "New Description",
        location: "Location",
        category: "local",
      };

      req.file = { filename: "test-image.jpg" };
      req.user = { id: 1 };

      // Call the controller method
      await createCause(req, res);

      // Assertions
      expect(Cause.create).toHaveBeenCalledWith({
        title: "New Cause",
        description: "New Description",
        location: "Location",
        category: "local",
        image: "test-image.jpg",
        user_id: 1,
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cause: mockCause,
      });
    });
  });

  describe("updateCause", () => {
    it("should update a cause if user is the owner", async () => {
      // Setup mock data
      const existingCause = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        user_id: 1,
      };

      const updatedCause = {
        id: 1,
        title: "Updated Title",
        description: "Updated Description",
        user_id: 1,
      };

      Cause.findById.mockResolvedValue(existingCause);
      Cause.update.mockResolvedValue(updatedCause);

      // Setup request
      req.params.id = "1";
      req.body = {
        title: "Updated Title",
        description: "Updated Description",
      };
      req.user = { id: 1 }; // Same as cause.user_id

      // Call the controller method
      await updateCause(req, res);

      // Assertions
      expect(Cause.findById).toHaveBeenCalledWith(1);
      expect(Cause.update).toHaveBeenCalledWith(1, expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        cause: updatedCause,
      });
    });

    it("should return 403 if user is not the owner", async () => {
      // Setup cause with different owner
      const existingCause = {
        id: 1,
        title: "Old Title",
        description: "Old Description",
        user_id: 2, // Different from req.user.id
      };

      Cause.findById.mockResolvedValue(existingCause);

      // Setup request
      req.params.id = "1";
      req.body = {
        title: "Updated Title",
        description: "Updated Description",
      };
      req.user = { id: 1, is_admin: false }; // Not an admin and not the owner

      // Call the controller method
      await updateCause(req, res);

      // Assertions
      expect(Cause.findById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: expect.stringContaining("not authorized"),
      });
    });
  });

  describe("addContribution", () => {
    it("should add a contribution to a cause", async () => {
      // Setup mock data
      const existingCause = {
        id: 1,
        title: "Test Cause",
        current_funding: "100.00",
        current_food: 10,
      };

      const mockContribution = {
        id: 1,
        cause_id: 1,
        user_id: 1,
        amount: "50.00",
        food_quantity: 5,
      };

      const updatedCause = {
        id: 1,
        title: "Test Cause",
        current_funding: "150.00",
        current_food: 15,
      };

      Cause.findById.mockResolvedValue(existingCause);
      Cause.addContribution.mockResolvedValue(mockContribution);
      Cause.updateFunding.mockResolvedValue(updatedCause);

      // Setup request
      req.params.id = "1";
      req.body = {
        amount: "50.00",
        food_quantity: 5,
        message: "Test contribution",
      };
      req.user = { id: 1 };

      // Call the controller method
      await addContribution(req, res);

      // Assertions
      expect(Cause.findById).toHaveBeenCalledWith(1);
      expect(Cause.addContribution).toHaveBeenCalledWith({
        cause_id: 1,
        user_id: 1,
        amount: "50.00",
        food_quantity: 5,
        message: "Test contribution",
        anonymous: false,
      });
      expect(Cause.updateFunding).toHaveBeenCalledWith(
        1,
        expect.any(Number),
        expect.any(Number)
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        contribution: mockContribution,
        cause: updatedCause,
      });
    });
  });
});
