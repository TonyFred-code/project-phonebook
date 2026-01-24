import { Router } from "express";
import { redirect } from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/", redirect);

export { indexRouter };
