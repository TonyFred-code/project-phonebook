#! /usr/bin/env node

import { Client } from "pg";

const SQL = `
-- 1. Create Categories safely
CREATE TABLE IF NOT EXISTS contact_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Insert ID 0 only if it doesn't exist
-- ON CONFLICT prevents the "duplicate key" error
INSERT INTO contact_categories (id, name, description) 
VALUES (0, 'unassigned_contacts', 'Default category for contacts')
ON CONFLICT (id) DO NOTHING;

-- 3. Create Contacts safely
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    category_id INT NOT NULL DEFAULT 0 
        REFERENCES contact_categories(id) 
        ON DELETE SET DEFAULT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Protection Function (CREATE OR REPLACE is safe)
CREATE OR REPLACE FUNCTION protect_default_category()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.id = 0 THEN
        RAISE EXCEPTION 'The default "unassigned_contacts" category (ID 0) cannot be deleted.';
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- 5. Create Trigger (Drop first to avoid "already exists" error)
DROP TRIGGER IF EXISTS prevent_default_cat_deletion ON contact_categories;
CREATE TRIGGER prevent_default_cat_deletion
BEFORE DELETE ON contact_categories
FOR EACH ROW EXECUTE FUNCTION protect_default_category();

-- 6. Sync Sequence safely
SELECT setval('contact_categories_id_seq', COALESCE((SELECT MAX(id) FROM contact_categories), 1), true);
`;

async function main() {
  const dbUrl = process.argv[2];

  if (!dbUrl) {
    console.error("Usage: node db/populatedb.js <database-url>");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  console.log("Seeding phone book...");

  await client.connect();
  await client.query(SQL);
  await client.end();

  console.log("Done.");
}

main();
