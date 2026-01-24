import { Router } from "express";
import {
  createContactGet,
  createContactPost,
  getPhoneBook,
} from "../controllers/contactsController.js";

const contactsRouter = Router();

contactsRouter.get("/new", createContactGet);
contactsRouter.post("/", createContactPost);
contactsRouter.get("/", getPhoneBook);

export { contactsRouter };
