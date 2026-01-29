import { Router } from "express";
import {
  createCategoryGet,
  createCategoryPost,
  getAllCategories,
  getCategory,
} from "../controllers/categoriesController.js";
import { categoryValidationRules } from "../validators/categoryValidator.js";

const categoriesRouter = Router();

categoriesRouter.post("/new", categoryValidationRules(), createCategoryPost);
categoriesRouter.get("/new", createCategoryGet);
categoriesRouter.get("/:categoryId", getCategory);
categoriesRouter.get("/", getAllCategories);

export { categoriesRouter };
