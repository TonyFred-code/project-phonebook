import pool from "./pool.js";

async function getAllContacts() {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, phone_number FROM contacts ORDER BY first_name ASC;"
  );

  return rows;
}

async function getContactById(id) {
  const { rows } = await pool.query(
    `
  SELECT 
    contacts.*,
    contact_categories.name AS category_name
    FROM contacts
    JOIN contact_categories
    ON contacts.category_id = contact_categories.id
    WHERE contact.id = $1;
`,
    [id]
  );

  return rows[0];
}

export { getAllContacts, getContactById };
