# Database Setup

This directory contains database configuration and setup scripts.

## Files

- `populatedb.js` - Script to create and seed the database
- `pool.js` - Database connection pool configuration
- `queries.js` - Database query functions

## Setup Instructions

### Local Development

- **Create the database:**

```bash
   createdb phonebook_db
```

- **Run the population script:**

```bash
   node db/populatedb.js "postgresql://username:password@localhost:5432/phonebook_db"
```

Or using npm script:

```bash
   npm run db:setup
```

### Production (e.g., Railway, Render, Heroku)

The `populatedb.js` script supports SSL connections for production databases:

```bash
node db/populatedb.js "your-production-database-url"
```

## Database Schema

See the main [README.md](../README.md#-database-schema) for schema details.

<!--TODO: ## Resetting the Database

To completely reset your database:

```bash
npm run db:reset
```

Or manually:
```bash
dropdb phonebook_db
createdb phonebook_db
node db/populatedb.js $DATABASE_URL
```
-->
