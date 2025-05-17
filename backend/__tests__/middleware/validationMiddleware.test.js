const {
  validateRequest,
  registerValidation,
  loginValidation,
  causeValidation,
} = require("../../middleware/validationMiddleware");
const { validationResult } = require("express-validator");

// Mock express-validator
jest.mock("express-validator", () => ({
  body: jest.fn().mockImplementation((field) => ({
    trim: jest.fn().mockReturnThis(),
    not: jest.fn().mockReturnThis(),
    isEmpty: jest.fn().mockReturnThis(),
    withMessage: jest.fn().mockReturnThis(),
    isEmail: jest.fn().mockReturnThis(),
    isLength: jest.fn().mockReturnThis(),
  })),
  validationResult: jest.fn(),
}));

describe("Validation Middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    next = jest.fn();

    jest.clearAllMocks();
  });

  describe("validateRequest", () => {
    it("should call next if no validation errors", () => {
      // Mock validationResult to return no errors
      validationResult.mockReturnValue({
        isEmpty: () => true,
      });

      // Call the middleware
      validateRequest(req, res, next);

      // Assertions
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("should return 400 if validation errors exist", () => {
      // Mock validation errors
      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => [
          { msg: "Name is required", param: "name" },
          { msg: "Invalid email", param: "email" },
        ],
      });

      // Call the middleware
      validateRequest(req, res, next);

      // Assertions
      expect(validationResult).toHaveBeenCalledWith(req);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        errors: expect.arrayContaining([
          expect.objectContaining({ msg: "Name is required" }),
          expect.objectContaining({ msg: "Invalid email" }),
        ]),
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  // Note: We don't need to fully test the validation chains since we've mocked express-validator
  // and the actual validation is handled by the library. But we can verify they are properly
  // structured and exported.

  describe("validation chains", () => {
    it("should export registerValidation with expected validations", () => {
      expect(registerValidation).toBeInstanceOf(Array);
      expect(registerValidation.length).toBeGreaterThan(0);
      // Last item should be the validateRequest middleware
      expect(registerValidation[registerValidation.length - 1]).toBe(
        validateRequest
      );
    });

    it("should export loginValidation with expected validations", () => {
      expect(loginValidation).toBeInstanceOf(Array);
      expect(loginValidation.length).toBeGreaterThan(0);
      // Last item should be the validateRequest middleware
      expect(loginValidation[loginValidation.length - 1]).toBe(validateRequest);
    });

    it("should export causeValidation with expected validations", () => {
      expect(causeValidation).toBeInstanceOf(Array);
      expect(causeValidation.length).toBeGreaterThan(0);
      // Last item should be the validateRequest middleware
      expect(causeValidation[causeValidation.length - 1]).toBe(validateRequest);
    });
  });
});
