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
    contact_categories.name AS category_name,
    contact_categories.is_default AS category_is_default,
    TO_CHAR(contacts.created_at, 'Mon DD, YYYY at HH12:MI AM') AS formatted_date
    FROM contacts
    JOIN contact_categories
    ON contacts.category_id = contact_categories.id
    WHERE contacts.id = $1;
`,
    [id]
  );

  return rows[0];
}

async function createContact(contact) {
  const { first_name, last_name, phone_number, email, category_id } = contact;

  // Ensure empty email becomes NULL for the database
  const finalEmail = email && email.trim() !== "" ? email.trim() : null;

  const query = `
    INSERT INTO contacts (first_name, last_name, phone_number, email, category_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
  `;

  const values = [
    first_name.trim(),
    last_name.trim(),
    phone_number.trim(),
    finalEmail,
    category_id,
  ];

  const { rows } = await pool.query(query, values);

  return rows[0].id;
}

async function getAllCategories() {
  const { rows } = await pool.query(
    `
    SELECT id, name, is_default
    FROM contact_categories
    ORDER BY is_default DESC, name ASC;
    `
  );

  return rows;
}

export { getAllContacts, getContactById, getAllCategories, createContact };
