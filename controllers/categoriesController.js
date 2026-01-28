import { getCategoriesWithContactCount } from "../db/queries.js";

async function getAllCategories(req, res) {
  const categories = await getCategoriesWithContactCount();

  console.log("Categories: ", categories);

  res.render("categories", { categories });
}

export { getAllCategories };
