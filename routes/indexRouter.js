import { Router } from "express";
import {
  createContactGet,
  getPhoneBook,
} from "../controllers/indexController.js";

const indexRouter = Router();

indexRouter.get("/contacts/new", createContactGet);
indexRouter.get("/", getPhoneBook);

export { indexRouter };
