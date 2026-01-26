import {
  createContact,
  getAllCategories,
  getAllContacts,
  getContactById,
} from "../db/queries.js";

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

export { getPhoneBook, createContactGet, createContactPost, contactById };
