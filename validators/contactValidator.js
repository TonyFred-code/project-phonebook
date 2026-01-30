import { body } from "express-validator";

function contactValidationRules() {
  return [
    body("first_name")
      .trim()
      .notEmpty()
      .withMessage("First name is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("First name must be between 1 and 100 characters"),

    body("last_name")
      .trim()
      .notEmpty()
      .withMessage("Last name is required")
      .isLength({ min: 1, max: 100 })
      .withMessage("Last name must be between 1 and 100 characters"),

    body("phone_number")
      .trim()
      .notEmpty()
      .withMessage("Phone number is required")
      .matches(/^\+?[0-9\s\-]{7,15}$/)
      .withMessage("Please enter a valid phone number (e.g., +234...)"),

    body("email")
      .optional({ checkFalsy: true })
      .trim()
      .isEmail()
      .withMessage("Please enter a valid email address")
      .isLength({ max: 255 })
      .withMessage("Email must not exceed 255 characters"),

    body("category_id")
      .notEmpty()
      .withMessage("Category is required")
      .isInt()
      .withMessage("Invalid category"),
  ];
}

export { contactValidationRules };
