import { getAllCategories, getAllContacts } from "../db/queries.js";

async function createContactGet(req, res) {
  const categories = await getAllCategories();

  res.render("new-contact-form", { categories });
}

async function createContactPost(req, res) {
  console.log(req.body);

  res.redirect("/");
}

async function getPhoneBook(req, res) {
  const contacts = await getAllContacts();

  console.log("Contacts: ", contacts);

  res.render("index", { contacts });
}

export { getPhoneBook, createContactGet, createContactPost };
