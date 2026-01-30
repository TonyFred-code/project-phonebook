import { validationResult } from "express-validator";
import {
  createContact,
  deleteContactById,
  getAllCategories,
  getAllContacts,
  getContactById,
  updateContact,
} from "../db/queries.js";
import { configDotenv } from "dotenv";

configDotenv();

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

  res.render("new-contact", { categories, errors: [], formData: {} });
}

async function createContactPost(req, res) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const categories = await getAllCategories();

    const formData = {
      first_name: req.body.first_name || "",
      last_name: req.body.last_name || "",
      phone_number: req.body.phone_number || "",
      email: req.body.email || "",
      category_id: req.body.category_id || "",
    };

    return res.render("new-contact", {
      categories,
      formData,
      errors: errors.array().map((err) => err.msg),
    });
  }

  const { first_name, last_name, phone_number, email, category_id } = req.body;

  try {
    const contactId = await createContact({
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      phone_number: phone_number.trim(),
      email: email ? email.trim() : null,
      category_id,
    });

    res.redirect(`/contacts/${contactId}`);
  } catch (error) {
    console.error("Error creating contact: ", error);

    const categories = await getAllCategories();

    const formData = {
      first_name: req.body.first_name || "",
      last_name: req.body.last_name || "",
      phone_number: req.body.phone_number || "",
      email: req.body.email || "",
      category_id: req.body.category_id || "",
    };

    res.render("new-contact", {
      categories,
      formData,
      errors: ["Failed to create contact. Please try again."],
    });
  }
}

async function deleteContact(req, res) {
  const { contactId } = req.params;
  const { delete_code } = req.body;

  if (delete_code !== process.env.CONTACT_DELETION_CODE) {
    return res.status(403).json({
      success: false,
      message: "Invalid contact deletion code",
    });
  }

  try {
    const result = await deleteContactById(contactId);

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Contact not found",
      });
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete the contact: ", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete contact",
    });
  }
}

async function contactById(req, res) {
  const contactId = req.params.contactId;

  const contact = await getContactById(contactId);

  if (!contact) {
    return res.status(404).render("404");
  }

  res.render("contact", { contact });
}

async function getPhoneBook(req, res) {
  const contacts = await getAllContacts();

  res.render("index", { contacts });
}

export {
  getPhoneBook,
  createContactGet,
  createContactPost,
  contactById,
  updateContactGet,
  updateContactPost,
  deleteContact,
};
