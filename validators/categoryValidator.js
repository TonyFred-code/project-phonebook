import { body } from "express-validator";

function categoryValidationRules() {
  return [
    body("category_name")
      .trim()
      .notEmpty()
      .withMessage("Category name is required")
      .isAlphanumeric("en-US", { ignore: " _-" })
      .withMessage(
        "Category name can only contain letters, numbers, underscores, hyphens and spaces"
      )
      .isLength({ min: 1, max: 100 })
      .withMessage("Category name must be between 1 and 100 characters"),

    body("category_description")
      .optional({ checkFalsy: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage("Category description must not exceed 255 characters"),
  ];
}

export { categoryValidationRules };
