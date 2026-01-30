import { Router } from "express";
import {
  createCategoryGet,
  createCategoryPost,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategoryGet,
  updateCategoryPost,
} from "../controllers/categoriesController.js";
import { categoryValidationRules } from "../validators/categoryValidator.js";

const categoriesRouter = Router();

categoriesRouter.post("/new", categoryValidationRules(), createCategoryPost);
categoriesRouter.get("/new", createCategoryGet);
categoriesRouter.post("/:categoryId/delete", deleteCategory);
categoriesRouter.post(
  "/:categoryId/update",
  categoryValidationRules(),
  updateCategoryPost
);
categoriesRouter.get("/:categoryId/edit", updateCategoryGet);
categoriesRouter.get("/:categoryId", getCategory);
categoriesRouter.get("/", getAllCategories);

export { categoriesRouter };
