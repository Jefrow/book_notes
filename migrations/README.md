# Database Migrations

## How to Run Migrations

### Option 1: Using psql command line
```bash
psql -U postgres -d Library -f migrations/add_isbn.sql
```

### Option 2: Using pgAdmin or another GUI
1. Open pgAdmin or your preferred PostgreSQL GUI
2. Connect to your `Library` database
3. Open the SQL query tool
4. Copy and paste the contents of `add_isbn.sql`
5. Execute the SQL

### Option 3: Using Node.js
```bash
node -e "
const { Pool } = require('pg');
const fs = require('fs');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'Library',
  password: 'your_password_here',
  port: 5432
});
const sql = fs.readFileSync('./migrations/add_isbn.sql', 'utf8');
pool.query(sql)
  .then(() => console.log('Migration completed successfully'))
  .catch(err => console.error('Migration failed:', err))
  .finally(() => pool.end());
"
```

## What This Migration Does

1. **Adds ISBN column** to the `book` table (VARCHAR(13) for ISBN-13)
2. **Adds unique constraint** on ISBN to prevent duplicate books
3. **Creates index** for fast ISBN lookups
4. **Adds data_source column** to track where metadata came from ('user', 'openlibrary', etc.)
5. **Creates index** on book titles for duplicate detection
6. **Optionally adds pg_trgm extension** for fuzzy search (commented out by default)

## After Running the Migration

Your app will now:
- ✅ Automatically fetch and store ISBNs from Open Library
- ✅ Prevent duplicate books by ISBN
- ✅ Show helpful error messages when users try to review the same book twice
- ✅ Track where book metadata came from
- ✅ Improve data quality with standardized book identification

## Rollback (if needed)

If you need to undo this migration:

```sql
-- Remove indexes
DROP INDEX IF EXISTS idx_book_isbn;
DROP INDEX IF EXISTS idx_book_title_lower;

-- Remove constraint
ALTER TABLE book DROP CONSTRAINT IF EXISTS book_isbn_unique;

-- Remove columns
ALTER TABLE book DROP COLUMN IF EXISTS isbn;
ALTER TABLE book DROP COLUMN IF EXISTS data_source;
```
