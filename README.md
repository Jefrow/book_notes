# Book Notes

A full-stack web application for book lovers to track, review, and organize their reading library. Users can add books, write reviews, manage their personal bookshelf, and discover books added by other readers.

## Features

- **User Authentication**: Secure registration and login with session-based authentication
- **Book Management**: Add books manually or fetch metadata from Open Library API
- **Personal Bookshelf**: Organize books with favorites, reading status, and custom filters
- **Book Reviews**: Write and view reviews with star ratings
- **Smart Filtering**: Filter books by reading status, favorites, and books you've added
- **Duplicate Prevention**: ISBN-based detection to prevent duplicate book entries
- **Responsive Design**: Mobile-friendly interface built with Tailwind CSS

## Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type safety
- **React Router** - Client-side routing
- **Tailwind CSS 4** - Utility-first styling
- **Vite** - Build tool and dev server
- **Lucide React** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime environment
- **Express 5** - Web framework
- **PostgreSQL** - Relational database
- **Passport.js** - Authentication middleware
- **bcrypt** - Password hashing
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store

### External APIs
- **Open Library API** - Book metadata, covers, and ISBNs

## Prerequisites

Before running this project locally, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **PostgreSQL** (v14 or higher) - [Download here](https://www.postgresql.org/download/)
- **npm** or **yarn** - Comes with Node.js

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/book-notes.git
cd book-notes
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up PostgreSQL Database

#### Create the Database

Open PostgreSQL command line (psql) or use a GUI tool like pgAdmin:

```bash
psql -U postgres
```

Then create the database:

```sql
CREATE DATABASE "Library";
```

#### Create Database Schema

Create the following tables in your `Library` database:

```sql
-- Users table
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Authors table
CREATE TABLE authors (
  author_id SERIAL PRIMARY KEY,
  author_name VARCHAR(255) UNIQUE NOT NULL
);

-- Books table
CREATE TABLE book (
  book_id SERIAL PRIMARY KEY,
  book_title VARCHAR(255) NOT NULL,
  author_id INTEGER REFERENCES authors(author_id),
  book_cover_url TEXT,
  book_summary TEXT,
  isbn VARCHAR(13),
  data_source VARCHAR(50) DEFAULT 'user',
  added_by_user_id INTEGER REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT book_isbn_unique UNIQUE (isbn),
  CONSTRAINT book_title_author_unique UNIQUE (book_title, author_id)
);

-- Reviews table
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES book(book_id) ON DELETE CASCADE,
  review_text TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_book_review UNIQUE (user_id, book_id)
);

-- User library table
CREATE TABLE user_library (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  book_id INTEGER REFERENCES book(book_id) ON DELETE CASCADE,
  is_favorite BOOLEAN DEFAULT false,
  read_status VARCHAR(20) CHECK (read_status IN ('read', 'reading', 'want_to_read')),
  added_to_shelf_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT unique_user_book UNIQUE (user_id, book_id)
);

-- Session table (required for connect-pg-simple)
CREATE TABLE session (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  CONSTRAINT session_pkey PRIMARY KEY (sid)
);

CREATE INDEX IDX_session_expire ON session (expire);

-- Create indexes for better performance
CREATE INDEX idx_book_isbn ON book(isbn) WHERE isbn IS NOT NULL;
CREATE INDEX idx_book_title_lower ON book(LOWER(book_title));
```

#### Run Migrations

Run the ISBN migration to add additional fields:

```bash
psql -U postgres -d Library -f migrations/add_isbn.sql
```

#### (Optional) Seed Fake Data

To populate the database with sample data for testing:

```bash
psql -U postgres -d Library -f migrations/seed_fake_data.sql
```

This will create:
- 5 demo users (password: `password123456`)
- 10 books with covers and metadata
- 24 book reviews
- User library entries with favorites and reading statuses

Demo user credentials:
- `alice@example.com` / `password123456`
- `bob@example.com` / `password123456`
- `carol@example.com` / `password123456`

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=Library
DB_PASSWORD=your_postgres_password
DB_PORT=5432

# Server Configuration
PORT=3000
FRONTEND_URL=http://localhost:5173

# Session Configuration
SESSION_SECRET=your_super_secret_session_key_change_this_in_production

# Bcrypt Configuration
BCRYPT_COST=12
```

**Important Security Notes:**
- Change `SESSION_SECRET` to a strong, random string in production
- Never commit your `.env` file to version control
- Use a strong password for your PostgreSQL database

### 5. Run the Application

#### Development Mode

Run both frontend and backend concurrently:

```bash
# Terminal 1 - Backend server
npm run dev:server

# Terminal 2 - Frontend dev server
npm run dev
```

Or run both in parallel:
```bash
npm run dev:all
```

The application will be available at:
- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000

#### Production Build

Build the frontend:
```bash
npm run build
```

The production build will be created in the `dist` folder.

## Project Structure

```
book-notes/
├── components/              # React components
│   ├── auth/               # Authentication components
│   ├── books/              # Book-related components
│   ├── layout/             # Navigation and layout
│   ├── library/            # Library views
│   ├── reviews/            # Review components
│   ├── shared/             # Shared utilities
│   └── ui/                 # Reusable UI components
├── Routes/                 # API routes and helpers
│   ├── Api.ts              # Frontend API client
│   └── helperFn.ts         # Backend helper functions
├── src/                    # Application source
│   ├── types.ts            # TypeScript type definitions
│   ├── main.tsx            # Application entry point
│   └── App.tsx             # Root component
├── migrations/             # Database migrations
│   ├── add_isbn.sql        # ISBN feature migration
│   └── seed_fake_data.sql  # Sample data
├── Server.js               # Express backend server
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start Vite dev server (frontend)
- `npm run dev:server` - Start Express server with nodemon (backend)
- `npm run dev:all` - Run both frontend and backend concurrently
- `npm run build` - Build production bundle
- `npm run preview` - Preview production build locally

## API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user

### Books
- `GET /api/books` - Get all books
- `POST /api/books/full` - Create book with review
- `GET /api/books/:book_id/reviews` - Get book reviews

### User Library
- `GET /api/bookshelf/mine` - Get user's bookshelf
- `POST /api/library/favorite` - Toggle favorite status
- `POST /api/library/status` - Update reading status

### Reviews
- `GET /api/books/mine` - Get user's books
- `GET /api/reviews/mine` - Get user's reviews

## Features in Detail

### Book Management
- Add books manually with title, author, rating, and review
- Automatic metadata fetching from Open Library API
- ISBN-based duplicate detection
- Book cover images from Open Library

### Personal Bookshelf
- **Filter Options:**
  - All books
  - Favorites
  - Currently reading
  - Read
  - Want to read
  - Books added by you
- **Quick Actions:**
  - Mark as favorite
  - Update reading status
  - View book details and reviews

### Reading Status
- **Read** - Books you've finished
- **Reading** - Currently reading
- **Want to Read** - Books on your wishlist

### Security Features
- Password hashing with bcrypt
- Session-based authentication
- Protected routes
- CSRF protection
- SQL injection prevention with parameterized queries

## Troubleshooting

### Database Connection Issues

If you see "Error connecting to database":
1. Verify PostgreSQL is running: `pg_isready`
2. Check your `.env` database credentials
3. Ensure the `Library` database exists
4. Verify the user has proper permissions

### Port Already in Use

If port 3000 or 5173 is already in use:
1. Change the port in `.env` (for backend)
2. Vite will automatically use the next available port (for frontend)

### Migration Errors

If migrations fail:
1. Check PostgreSQL connection
2. Verify you're connected to the correct database
3. Ensure you have CREATE privileges
4. Check for syntax errors in SQL files

### Session Issues

If sessions aren't persisting:
1. Verify the `session` table exists
2. Check `SESSION_SECRET` is set in `.env`
3. Clear browser cookies and try again

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Book metadata provided by [Open Library API](https://openlibrary.org/developers/api)
- Icons from [Lucide React](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)

## Contact

For questions or support, please open an issue in the GitHub repository.
