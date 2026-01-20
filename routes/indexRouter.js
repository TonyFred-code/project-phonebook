import { Router } from "express";
import { getPhoneBook } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", getPhoneBook);

export { indexRouter };
