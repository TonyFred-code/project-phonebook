import pool from "./pool.js";

async function getAllContacts() {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, phone_number FROM contacts ORDER BY first_name ASC, last_name ASC;"
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

async function createCategory(category) {
  const { category_name, category_description } = category;

  const query = `
  INSERT INTO contact_categories (name, description)
  VALUES ($1, $2)
  RETURNING id;
  `;

  const values = [category_name.trim(), category_description.trim()];

  const { rows } = await pool.query(query, values);

  return rows[0].id;
}

async function updateCategory(category) {
  const { name, description, id } = category;

  const query = `
  UPDATE contact_categories
  SET name = $1,
      description = $2
  WHERE id = $3
  RETURNING *;
  `;

  const values = [name, description, id];

  try {
    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new Error(`Category with id ${id} not found!`);
    }

    return rows[0];
  } catch (error) {
    console.error("Error updating category: ", error);
    throw error;
  }
}

async function updateContact(contact) {
  const { first_name, last_name, phone_number, email, category_id, id } =
    contact;

  // Ensure empty email becomes NULL for the database
  const finalEmail = email && email.trim() !== "" ? email.trim() : null;

  const query = `
    UPDATE contacts 
    SET first_name = $1,
        last_name = $2,
        phone_number = $3,
        email = $4,
        category_id = $5
    WHERE id = $6
    RETURNING *;
  `;

  const values = [
    first_name.trim(),
    last_name.trim(),
    phone_number.trim(),
    finalEmail,
    category_id,
    id,
  ];

  try {
    const { rows, rowCount } = await pool.query(query, values);

    if (rowCount === 0) {
      throw new Error(`Contact with id ${id} not found`);
    }

    return rows[0];
  } catch (error) {
    console.error("Error updating contact:", error);
    throw error;
  }
}

async function getCategoryById(categoryId) {
  const { rows } = await pool.query(
    `
    SELECT id, name, description FROM contact_categories
    WHERE id = $1;`,
    [categoryId]
  );

  return rows[0];
}

async function deleteContactById(contactId) {
  return await pool.query(
    `
      DELETE FROM contacts
      WHERE id = $1
      RETURNING *
      `,
    [contactId]
  );
}

async function deleteCategoryById(category_id) {
  return await pool.query(
    `
    DELETE FROM contact_categories
    WHERE id = $1
    RETURNING *;`,
    [category_id]
  );
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

async function getCategoriesWithContactCount() {
  const { rows } = await pool.query(
    `
    SELECT 
    cc.id, 
    cc.name, 
    cc.is_default,
    COUNT(c.id) AS contact_count
  FROM contact_categories cc
  LEFT JOIN contacts c ON cc.id = c.category_id
  GROUP BY cc.id, cc.name, cc.is_default
  ORDER BY cc.is_default DESC, cc.name ASC;
    `
  );

  return rows;
}

async function getCategoryWithContacts(category_id) {
  const { rows } = await pool.query(
    `SELECT 
       cc.id AS category_id,
       cc.name AS category_name,
       cc.description,
       cc.is_default,
       TO_CHAR(cc.created_at, 'Mon DD, YYYY at HH12:MI AM') AS formatted_date,
       c.id AS contact_id,
       c.first_name,
       c.last_name,
       c.phone_number
     FROM contact_categories cc
     LEFT JOIN contacts c ON cc.id = c.category_id
     WHERE cc.id = $1
     ORDER BY LOWER(c.first_name) ASC, LOWER(c.last_name) ASC;`,
    [category_id]
  );

  if (rows.length === 0) {
    return null; // Category doesn't exist
  }

  const category = {
    id: rows[0].category_id,
    name: rows[0].category_name,
    description: rows[0].description,
    is_default: rows[0].is_default,
    formatted_date: rows[0].formatted_date,
    contacts: rows
      .filter((row) => row.contact_id !== null)
      .map((row) => ({
        id: row.contact_id,
        first_name: row.first_name,
        last_name: row.last_name,
        phone_number: row.phone_number,
      })),
    contact_count: rows.filter((row) => row.contact_id !== null).length,
  };

  return category;
}

export {
  getAllContacts,
  getContactById,
  getAllCategories,
  createContact,
  updateContact,
  deleteContactById,
  getCategoriesWithContactCount,
  getCategoryWithContacts,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategoryById,
};
