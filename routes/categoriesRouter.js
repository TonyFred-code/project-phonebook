import { Router } from "express";
import { getAllCategories } from "../controllers/categoriesController.js";

const categoriesRouter = Router();

categoriesRouter.get("/", getAllCategories);

export { categoriesRouter };
