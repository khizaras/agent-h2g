const { body, validationResult } = require("express-validator");

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

// User registration validation rules
const registerValidation = [
  body("name").trim().not().isEmpty().withMessage("Name is required"),
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];

// User login validation rules
const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email"),
  body("password").not().isEmpty().withMessage("Password is required"),
  validateRequest,
];

// Cause creation validation rules
const causeValidation = [
  body("title").trim().not().isEmpty().withMessage("Title is required"),
  body("description")
    .trim()
    .not()
    .isEmpty()
    .withMessage("Description is required"),
  body("location").trim().not().isEmpty().withMessage("Location is required"),
  body("category")
    .isIn(["local", "emergency", "recurring"])
    .withMessage("Category must be local, emergency, or recurring"),
  body("funding_goal")
    .optional()
    .isNumeric()
    .withMessage("Funding goal must be a number"),
  body("food_goal")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Food goal must be a positive integer"),
  validateRequest,
];

// Contribution validation rules
const contributionValidation = [
  body("cause_id").not().isEmpty().withMessage("Cause ID is required"),
  body("amount").optional().isNumeric().withMessage("Amount must be a number"),
  body("food_quantity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Food quantity must be a positive integer"),
  body("message").optional().trim(),
  body("anonymous")
    .optional()
    .isBoolean()
    .withMessage("Anonymous must be a boolean"),
  validateRequest,
];

// Feedback validation rules
const feedbackValidation = [
  body("cause_id").not().isEmpty().withMessage("Cause ID is required"),
  body("rating")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5"),
  body("comment").optional().trim(),
  validateRequest,
];

// Password update validation rules
const passwordValidation = [
  body("currentPassword")
    .not()
    .isEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 6 })
    .withMessage("New password must be at least 6 characters long"),
  validateRequest,
];

module.exports = {
  registerValidation,
  loginValidation,
  causeValidation,
  contributionValidation,
  feedbackValidation,
  passwordValidation,
};
