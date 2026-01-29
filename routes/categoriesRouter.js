import { Router } from "express";
import {
  createCategoryGet,
  getAllCategories,
  getCategory,
} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/new", createCategoryGet);
categoriesRouter.get("/:categoryId", getCategory);
categoriesRouter.get("/", getAllCategories);

export { categoriesRouter };
