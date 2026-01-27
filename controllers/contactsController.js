import { validationResult } from "express-validator";
import {
  createContact,
  getAllCategories,
  getAllContacts,
  getContactById,
  updateContact,
} from "../db/queries.js";

async function updateContactGet(req, res) {
  const contactId = req.params.contactId;
  const contact = await getContactById(contactId);
  const categories = await getAllCategories();

  res.render("edit-contact", { categories, contact });
}

async function updateContactPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const categories = await getAllCategories();
    const contact = {
      id: req.params.contactId,
      ...req.body,
    };

    return res.render("edit-contact", {
      contact,
      categories,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { contactId } = req.params;
  const { first_name, last_name, phone_number, email, category_id } = req.body;

  try {
    await updateContact({
      id: contactId,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone_number: phone_number.trim(),
      email: email ? email.trim() : null,
      category_id,
    });

    res.redirect(`/contacts/${contactId}`);
  } catch (error) {
    console.error("Error updating contact: ", error);

    const categories = await getAllCategories();
    const contact = {
      id: contactId,
      first_name,
      last_name,
      phone_number,
      email,
      category_id,
    };

    res.render("edit-contact", {
      contact,
      categories,
      errors: ["Failed to update contact. Please try again."],
    });
  }
}

async function createContactGet(req, res) {
  const categories = await getAllCategories();

  res.render("new-contact-form", { categories });
}

async function createContactPost(req, res) {
  const contactFormData = req.body;

  const createdContactId = await createContact(contactFormData);
  console.log(createdContactId);
  res.redirect("/"); // "/contacts/:id"
} // TODO: ADD CONTACT FORM VALIDATION

async function contactById(req, res) {
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId);

  if (!contact) {
    res.status(404).render("404");
  }

  console.log(contact);

  res.render("contact", { contact });
}

async function getPhoneBook(req, res) {
  const contacts = await getAllContacts();

  console.log("Contacts: ", contacts);

  res.render("index", { contacts });
}

export {
  getPhoneBook,
  createContactGet,
  createContactPost,
  contactById,
  updateContactGet,
  updateContactPost,
};
