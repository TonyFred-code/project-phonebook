import { Router } from "express";
import {
  getAllCategories,
  getCategory,
} from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/:categoryId", getCategory);
categoriesRouter.get("/", getAllCategories);

export { categoriesRouter };
