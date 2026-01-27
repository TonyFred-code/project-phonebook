import { Router } from "express";
import {
  contactById,
  createContactGet,
  createContactPost,
  getPhoneBook,
  updateContactGet,
} from "../controllers/contactsController.js";

const contactsRouter = Router();

contactsRouter.get("/new", createContactGet);
contactsRouter.get("/:contactId/edit", updateContactGet);
contactsRouter.get("/:contactId", contactById);
contactsRouter.post("/", createContactPost);
contactsRouter.get("/", getPhoneBook);

export { contactsRouter };
