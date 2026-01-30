import { validationResult } from "express-validator";
import {
  createCategory,
  deleteCategoryById,
  getCategoriesWithContactCount,
  getCategoryById,
  getCategoryWithContacts,
  updateCategory,
} from "../db/queries.js";
import { configDotenv } from "dotenv";

configDotenv();

async function updateCategoryGet(req, res) {
  const categoryId = req.params.categoryId;

  const category = await getCategoryById(categoryId);

  if (!category) {
    return res.status(404).render("404");
  }

  console.log(category);

  res.render("edit-category", { category });
}

async function updateCategoryPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const category = {
      id: req.params.categoryId,
      name: req.body.category_name,
      description: req.body.category_description,
    };

    return res.render("edit-category", {
      category,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { categoryId } = req.params;
  const { category_description, category_name } = req.body;

  try {
    const category = {
      id: categoryId,
      name: category_name.trim(),
      description: category_description.trim(),
    };
    const result = await updateCategory(category);

    if (result.rowCount === 0) {
      return res.render("edit-category", {
        category,
        errors: ["Category not found"],
      });
    }

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    console.error("Error updating category: ", error);

    let errorMessage =
      error.msg || "Failed to update category. Please try again.";

    const category = {
      id: categoryId,
      description: category_description,
      name: category_name,
    };

    // db trigger prevents default category status modification
    // frontend does not (should not?) have the modify/delete capabilities
    // for the is_default  = true category
    if (error.message?.includes("Cannot unset is_default")) {
      errorMessage = "Cannot modify the default category's status";
    }

    // Unique constraint violation (duplicate name)
    if (error.code === "23505") {
      errorMessage = "A category with this name already exists";
    }

    res.render("edit-category", {
      category,
      errors: [errorMessage],
    });
  }
}

async function deleteCategory(req, res) {
  const { categoryId } = req.params;
  const { delete_code } = req.body;

  if (delete_code !== process.env.CATEGORY_DELETION_CODE) {
    return res.status(403).json({
      success: false,
      message: "Invalid category deletion code",
    });
  }

  try {
    const result = await deleteCategoryById(categoryId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Failed to delete the category: ", error);

    // Catch RAISE EXCEPTION from db triggers
    // Should not happen
    // (frontend view doesn't have
    // delete or modify option for is_default = true)
    if (
      error.code === "P0001" ||
      error.message?.includes("Cannot delete the default category")
    ) {
      return res.status(400).json({
        success: false,
        message: error.message || "Cannot delete the default category",
      });
    }

    // Foreign key violation (shouldn't happen if trigger works)
    // db auto reassigns contacts on deleted category to is_default = true
    // category
    if (error.code === "23503") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete category with assigned contacts",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
    });
  }
}

async function createCategoryGet(req, res) {
  res.render("new-category");
}

async function createCategoryPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formData = {
      category_name: req.body.category_name || "",
      category_description: req.body.category_description || "",
    };

    return res.render("new-category", {
      formData,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { category_name, category_description } = req.body;

  try {
    const categoryId = await createCategory({
      category_name: category_name.trim(),
      category_description: category_description.trim(),
    });

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    console.error("Error creating category: ", error);

    let errorMessage =
      error.msg || "Failed to create category. Please try again.";

    const formData = {
      category_name: req.body.category_name || "",
      description: req.body.category_description || "",
    };

    // Unique constraints violation (duplicate name)
    if (error.code === "23505") {
      errorMessage = "A category with this name already exists.";
    }

    res.render("new-category", {
      formData,
      errors: [errorMessage],
    });
  }
}

async function getCategory(req, res) {
  const categoryId = req.params.categoryId;
  const category = await getCategoryWithContacts(categoryId);

  if (!category) {
    return res.status(404).render("404");
  }

  console.log(category);

  res.render("category", { category });
}

async function getAllCategories(req, res) {
  const categories = await getCategoriesWithContactCount();

  console.log("Categories: ", categories);

  res.render("categories", { categories });
}

export {
  getAllCategories,
  getCategory,
  createCategoryGet,
  createCategoryPost,
  updateCategoryGet,
  updateCategoryPost,
  deleteCategory,
};
