import {
  getCategoriesWithContactCount,
  getCategoryWithContacts,
} from "../db/queries.js";

async function createCategoryGet(req, res) {
  res.render("new-category");
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

export { getAllCategories, getCategory, createCategoryGet };
