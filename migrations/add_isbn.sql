-- Migration: Add ISBN support to book table
-- Run this SQL in your PostgreSQL database

-- Add ISBN column (13 characters for ISBN-13, nullable for existing books)
ALTER TABLE book ADD COLUMN isbn VARCHAR(13);

-- Add unique constraint on ISBN (allows NULL values, but enforces uniqueness for non-NULL)
ALTER TABLE book ADD CONSTRAINT book_isbn_unique UNIQUE (isbn);

-- Create index for faster ISBN lookups
CREATE INDEX idx_book_isbn ON book(isbn) WHERE isbn IS NOT NULL;

-- Add data_source column to track metadata origin
ALTER TABLE book ADD COLUMN data_source VARCHAR(50) DEFAULT 'user';

-- Add index for book title searches (for duplicate detection)
CREATE INDEX idx_book_title_lower ON book(LOWER(book_title));

-- Optional: Add pg_trgm extension for fuzzy matching (if not already installed)
-- Uncomment the following lines if you want fuzzy search capabilities
-- CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- CREATE INDEX idx_book_title_trgm ON book USING gin (book_title gin_trgm_ops);
