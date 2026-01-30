#! /usr/bin/env node

import { Client } from "pg";

const SQL = `
-- 1. Categories table
CREATE TABLE IF NOT EXISTS contact_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Enforce only ONE default category
DROP INDEX IF EXISTS one_default_category;
CREATE UNIQUE INDEX one_default_category
ON contact_categories (is_default)
WHERE is_default = true;

-- 3. Seed default category (idempotent)
INSERT INTO contact_categories (name, description, is_default)
VALUES ('unassigned', 'Default category for contacts', true)
ON CONFLICT (name) DO NOTHING;

-- 4. Contacts table
CREATE TABLE IF NOT EXISTS contacts (
    id BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    category_id BIGINT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES contact_categories(id)
        ON DELETE RESTRICT
);

-- 5. Dynamically set default category_id
DO $$
DECLARE
    default_cat_id BIGINT;
BEGIN
    SELECT id INTO default_cat_id
    FROM contact_categories
    WHERE is_default = true;

    IF default_cat_id IS NOT NULL THEN
        EXECUTE format(
            'ALTER TABLE contacts ALTER COLUMN category_id SET DEFAULT %s',
            default_cat_id
        );
    END IF;
END $$;

-- 6. Protect default category
CREATE OR REPLACE FUNCTION protect_default_category()
RETURNS TRIGGER AS $$
BEGIN
    -- Prevent deletion
    IF TG_OP = 'DELETE' AND OLD.is_default THEN
        RAISE EXCEPTION 'Cannot delete the default category.';
    END IF;

    -- Prevent unsetting is_default
    IF TG_OP = 'UPDATE' AND OLD.is_default AND NOT NEW.is_default THEN
        RAISE EXCEPTION 'Cannot unset is_default on the default category.';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;  
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_default_category_change ON contact_categories;
CREATE TRIGGER prevent_default_category_change
BEFORE DELETE OR UPDATE ON contact_categories
FOR EACH ROW
EXECUTE FUNCTION protect_default_category();

-- 7. Reassign contacts on category deletion
CREATE OR REPLACE FUNCTION reassign_to_default_category()
RETURNS TRIGGER AS $$
DECLARE
    default_cat_id BIGINT;
BEGIN
    SELECT id INTO default_cat_id
    FROM contact_categories
    WHERE is_default = true;

    UPDATE contacts
    SET category_id = default_cat_id
    WHERE category_id = OLD.id;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS reassign_contacts_on_category_delete ON contact_categories;
CREATE TRIGGER reassign_contacts_on_category_delete
BEFORE DELETE ON contact_categories
FOR EACH ROW
WHEN (NOT OLD.is_default)
EXECUTE FUNCTION reassign_to_default_category();

`;

async function main() {
  // Allow DATABASE_URL from argument or environment variable
  const dbUrl = process.argv[2] || process.env.DATABASE_URL;

  if (!dbUrl) {
    console.error("Error: No database URL provided.");
    console.error("\nUsage:");
    console.error("  node db/populatedb.js <database-url>");
    console.error("  npm run db:setup");
    console.error("\nOr set DATABASE_URL in your .env file");
    process.exit(1);
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("🔌 Connecting to database...");
    await client.connect();

    console.log("📊 Creating tables and seeding data...");
    await client.query(SQL);

    console.log("✅ Database setup complete!");
    console.log("🎉 Your phonebook is ready to use!");
  } catch (error) {
    console.error("❌ Error setting up database:", error.message);
    console.error("\nFull error:", error);
    process.exit(1);
  } finally {
    await client.end();
    console.log("🔌 Database connection closed.");
  }
}

main();
