# 📞 Phone-book Application

A contact management system built with Express.js and PostgreSQL. Organize your contacts into categories and manage them with a clean, intuitive interface.

## ✨ Features

### Contact Management

- ✅ Create, read, update, and delete contacts
- ✅ Store name, phone number, and email
- ✅ Organize contacts into categories
- ✅ Alphabetical sorting by name
- ✅ Form validation (server-side and client-side)

### Category Management

- ✅ Create custom categories for organizing contacts
- ✅ View all contacts within a category
- ✅ Protected default "unassigned" category
- ✅ Automatic contact reassignment on category deletion

### Security

- ✅ Deletion code protection for contacts and categories
- ✅ Server-side validation with express-validator
- ✅ SQL injection protection via parameterized queries

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Template Engine:** EJS
- **Validation:** express-validator
- **Styling:** Plain Old CSS

## 📋 Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## 🚀 Installation

- **Clone the repository**

```bash
   git clone git@github.com:TonyFred-code/project-phonebook.git
   cd project-phonebook
```

- **Install dependencies**

```bash
   npm install
```

- **Set up environment variables**

  Create a `.env` file in the root directory:

```env
   # Database
   DATABASE_URL=postgresql://username:password@localhost:5432/phonebook_db

   # Deletion codes (set your own secure codes)
   CONTACT_DELETION_CODE=your_contact_code_here
   CATEGORY_DELETION_CODE=your_category_code_here

   # Server
   PORT=3000
```

- **Create and populate the database**
  First, create the database:

```bash
   createdb phonebook_db
```

Then run the population script:

```bash
   node db/populatedb.js "postgresql://username:password@localhost:5432/phonebook_db"
```

Or using the DATABASE_URL from your `.env`:

```bash
   node db/populatedb.js $DATABASE_URL
```

- **Start the application** (development with auto-reload)

```bash
   npm run server
```

- **Access the application**

  Open your browser and navigate to: `http://localhost:3000`

## 🗄️ Database Setup

The database schema is automatically created by running `populatedb.js`, which:

- Creates the `contact_categories` table
- Creates the `contacts` table
- Sets up foreign key constraints
- Creates database triggers for:
  - Protecting the default category
  - Auto-reassigning contacts on category deletion
- Seeds the default "unassigned" category

## 📁 Project Structure

```md
project-phonebook/
├── controllers/
│ ├── categoriesController.js # Category CRUD logic
│ └── contactsController.js # Contact CRUD logic
├── db/
│ ├── pool.js # Database connection pool
│ ├── queries.js # Database query functions
│ └── populatedb.js # Database initialization script
├── routes/
│ ├── categoriesRouter.js # Category routes
│ ├── contactsRouter.js # Contact routes
│ └── indexRouter.js # Root route
├── validators/
│ ├── contactValidator.js # Contact input validation rules
│ └── categoryValidator.js # Category input validation rules
├── views/
│ └── \*.ejs # Page views (yet to be properly arranged)
├── public/
│ ├── images/ # Images (icons)
│ ├── scripts/ # JS files
│ └── styles/ # CSS files
├── .env # Environment variables (not in git)
├── .gitignore
├── app.js # Express app configuration
├── package.json
└── README.md
```

## 🗄️ Database Schema

### Tables

#### contact_categories

- `id` (BIGSERIAL, PRIMARY KEY)
- `name` (VARCHAR(50), UNIQUE, NOT NULL)
- `description` (TEXT)
- `is_default` (BOOLEAN, DEFAULT false)
- `created_at` (TIMESTAMPTZ)

#### contacts

- `id` (BIGSERIAL, PRIMARY KEY)
- `first_name` (VARCHAR(100), NOT NULL)
- `last_name` (VARCHAR(100), NOT NULL)
- `phone_number` (VARCHAR(20), NOT NULL)
- `email` (VARCHAR(255))
- `category_id` (BIGINT, FOREIGN KEY)
- `created_at` (TIMESTAMPTZ)

### Constraints

- Only one category can have `is_default = true`
- Default category cannot be deleted (nor modified through the frontend)
- Deleting a category automatically reassigns contacts to default
- Foreign key constraint on `contacts.category_id`

## 🎯 Usage

### Managing Contacts

1. **Add a contact:** Click "New Contact" and fill in the form
2. **View contacts:** Browse the contacts list or view individual contact details
3. **Edit a contact:** Click the edit button on any contact
4. **Delete a contact:** Click delete and enter the deletion code

### Managing Categories

1. **Add a category:** Navigate to Categories → New Category
2. **View category:** See all contacts in a specific category
3. **Edit category:** Update category name or description
4. **Delete category:** Contacts are automatically moved to "unassigned"

## 🔒 Security Notes

- Deletion codes are required to prevent accidental deletions
- Never commit your `.env` file to version control
- Use strong, unique codes for production environments
- All user input is validated and sanitized

## 📝 API Endpoints

### Index

- `GET /` - Redirect to contacts list

### Contacts

- `GET /contacts` - List all contacts
- `GET /contacts/new` - New contact form
- `POST /contacts/new` - Create contact
- `GET /contacts/:id` - View contact
- `GET /contacts/:id/edit` - Edit contact form
- `POST /contacts/:id/update` - Update contact
- `POST /contacts/:id/delete` - Delete contact

### Categories

- `GET /categories` - List all categories
- `GET /categories/new` - New category form
- `POST /categories/new` - Create category
- `GET /categories/:id` - View category with contacts
- `GET /categories/:id/edit` - Edit category form
- `POST /categories/:id/update` - Update category
- `POST /categories/:id/delete` - Delete category

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

Alfred O. Faith - [Tony Fred](https://github.com/tonyFred-code)

## 🙏 Acknowledgments

- Built as part of [Project: Inventory Application | The Odin Project](https://www.theodinproject.com/lessons/node-path-nodejs-inventory-application)
- Icons from [Lucide Icons](https://lucide.dev/)

## 📞 Support

For issues or questions, please open an issue on GitHub.
