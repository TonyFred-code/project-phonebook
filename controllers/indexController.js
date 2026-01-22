import { getAllContacts } from "../db/queries.js";

async function getPhoneBook(req, res) {
  const contacts = await getAllContacts();

  console.log("Contacts: ", contacts);

  res.render("index", { contacts });
}

export { getPhoneBook };
