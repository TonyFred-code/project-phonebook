# Changelog

All notable changes to the Phonebook Application will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-01-30

### Fixed deployment seeding ssl

- Remove conditional ssl database pool check in database seeding

### Further Additions

- Wrap db calls in try/catch blocks
- Resolve category description max characters length db inconsistency

## [1.0.0] - 2026-01-30

### Added - Contact Management

- Create new contacts with first name, last name, phone number, and optional email
- View all contacts in a sortable list (alphabetically by first and last name)
- View individual contact details with category information
- Edit existing contacts with form pre-populated with current data
- Delete contacts with deletion code protection
- Client-side and server-side form validation for contact data
- Phone number validation with regex pattern (+234 format)
- Email validation (optional field)
- Case-insensitive alphabetical sorting of contacts
- Formatted timestamp display for contact creation date

### Added - Category Management

- Create custom categories with name and optional description
- View all categories with contact count for each
- View category details showing all associated contacts
- Edit category name and description
- Delete categories with automatic contact reassignment to default category
- Protected default "unassigned" category that cannot be deleted or modified
- Deletion code protection for category deletion
- Unique category name constraint
- Category sorting (default first, then alphabetical by name)
- Contact count display per category
- Formatted timestamp display for category creation date

### Added - Database & Schema

- PostgreSQL database schema with two main tables (contacts, contact_categories)
- Foreign key relationship between contacts and categories
- Unique constraint on category names
- Partial unique index ensuring only one default category
- Default category seeding on database initialization
- Database triggers for:
  - Protecting default category from deletion
  - Preventing is_default flag removal on default category
  - Automatic contact reassignment when category is deleted
- Dynamic default value for category_id based on default category
- BIGSERIAL primary keys for scalability
- Timestamp columns with timezone support
- ON DELETE RESTRICT constraint with trigger-based reassignment

### Added - Security & Validation

- Environment variable configuration for sensitive data
- Deletion codes for both contacts and categories
- express-validator integration for server-side validation
- SQL injection protection via parameterized queries
- Input sanitization (trimming whitespace)
- Error handling for:
  - Unique constraint violations (duplicate category names)
  - Foreign key violations
  - Trigger exceptions (protected category operations)
  - Database connection errors
  - 404 Not Found errors
  - 403 Forbidden errors for invalid deletion codes
- Password-type input fields for deletion codes

### Added - UI/UX Features

- Responsive navigation between contacts and categories
- Modal dialogs for deletion confirmation
- Visual feedback for form errors
- Color-coded action buttons (blue for edit, red for delete)
- SVG icons from Lucide for better UI
- Styled forms with proper labels and placeholders
- Error message display in dialogs
- Keyboard navigation support (Enter to submit, Escape to cancel)
- Loading states and user feedback

### Added - Project Infrastructure

- Express.js application structure with MVC pattern
- EJS templating engine for server-side rendering
- Modular routing (contacts, categories, index)
- Controller layer for business logic separation
- Database query abstraction layer
- Environment-based configuration
- .gitignore for sensitive files
- Package.json with all dependencies
- README.md with setup instructions
- This CHANGELOG.md

### Technical Details

- **Dependencies:**
- dotenv: ^17.2.3,
- ejs: ^3.1.10,
- express: ^5.2.1,
- express-validator: ^7.3.1,
- pg: ^8.16.3

- **Database:**
  - PostgreSQL 12+
  - Connection pooling for performance
  - Prepared statements for security

- **Code Quality:**
  - Consistent error handling patterns
  - Separation of concerns (routes, controllers, queries)
  - Reusable validation rules
  - DRY principles applied

### Notes

- First production-ready release
- All core CRUD operations implemented for both contacts and categories
- Comprehensive error handling and validation in place
- Database schema includes protective triggers and constraints

[1.0.0]: https://github.com/yourusername/project-phonebook/releases/tag/v1.0.0
