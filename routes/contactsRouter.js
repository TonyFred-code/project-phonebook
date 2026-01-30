import { Router } from "express";
import {
  contactById,
  createContactGet,
  createContactPost,
  deleteContact,
  getPhoneBook,
  updateContactGet,
  updateContactPost,
} from "../controllers/contactsController.js";
import { contactValidationRules } from "../validators/contactValidator.js";

const contactsRouter = Router();

contactsRouter.get("/new", createContactGet);
contactsRouter.post("/new", contactValidationRules(), createContactPost);
contactsRouter.post(
  "/:contactId/update",
  contactValidationRules(),
  updateContactPost
);
contactsRouter.post("/:contactId/delete", deleteContact);
contactsRouter.get("/:contactId/edit", updateContactGet);
contactsRouter.get("/:contactId", contactById);
contactsRouter.get("/", getPhoneBook);

export { contactsRouter };
