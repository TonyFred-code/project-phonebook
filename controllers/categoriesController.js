import { validationResult } from "express-validator";
import {
  createCategory,
  getCategoriesWithContactCount,
  getCategoryById,
  getCategoryWithContacts,
  updateCategory,
} from "../db/queries.js";

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
      ...req.body,
    };

    return res.render("edit-category", {
      category,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { categoryId } = req.params;
  const { category_description, category_name } = req.body;

  try {
    await updateCategory({
      id: categoryId,
      category_name: category_name.trim(),
      category_description: category_description.trim(),
    });

    res.redirect(`/categories/${categoryId}`);
  } catch (error) {
    console.error("Error updating category: ", error);

    const category = {
      id: categoryId,
      category_description,
      category_name,
    };

    res.render("edit-category", {
      category,
      errors: ["Failed to update category. Please try again."],
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
      description: req.body.category_description || "",
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

    const formData = {
      category_name: req.body.category_name || "",
      description: req.body.category_description || "",
    };
    res.render("new-category", {
      formData,
      errors: ["Failed to create category. Please try again."],
    });
  }
}

async function getCategory(req, res) {
  const categoryId = req.params.categoryId;
  const category = await getCategoryWithContacts(categoryId);

  if (!category) {
    res.status(404).render("404");
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
};
