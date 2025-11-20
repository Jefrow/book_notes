import express from "express";
import session from "express-session";
import pg from "pg";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pgSessionFactory from "connect-pg-simple";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
const ROUNDS = Number(process.env.BCRYPT_COST ?? 12);
const PgSession = pgSessionFactory(session);

const { Pool } = pg;

// Database configuration from environment variables
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Library",
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// Test database connection
pool.connect((err, _client, release) => {
  if (err) {
    console.error("Error connecting to database:", err.stack);
  } else {
    console.log("Database connected successfully");
    release();
  }
});

app.set("trust proxy", 1);

// CORS configuration from environment variables
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    store: new PgSession({
      pool,
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//get request that fetches the books from the book table.

// Health check endpoint
app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Login required" });
  }
  next();
}

//"Mine" endpoints (use session user)
app.get("/api/reviews/mine", requireAuth, async (req, res) => {
  const me = req.user;
  try {
    const { rows } = await pool.query(
      `SELECT book.book_title, book.book_cover_url, authors.author_name, reviews.review_text, reviews.rating
    FROM reviews
    JOIN book ON book.book_id = reviews.book_id
    Join authors ON authors.author_id = book.author_id
    WHERE reviews.user_id = $1`,
      [me.user_id]
    );
    res.json({ reviews: rows });
  } catch (err) {
    console.error("reviews/mine error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/api/books/mine", requireAuth, async (req, res) => {
  const me = req.user;
  try {
    const { rows } = await pool.query(
      `SELECT book.book_id, book.book_title, book.book_cover_url, authors.author_name
      From book
      JOIN authors ON authors.author_id = book.author_id
      WHERE book.added_by_user_id = $1`,
      [me.user_id]
    );
    res.json({ books: rows });
  } catch (err) {
    console.error("books/mine error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT book.book_id, book.book_title, book.book_cover_url, authors.author_name
      FROM book
      INNER JOIN authors ON book.author_id = authors.author_id`
    );
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching book:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/api/bookshelf/mine", requireAuth, async (req, res) => {
  const me = req.user;
  try {
    const { rows } = await pool.query(
      `SELECT DISTINCT book.book_id, book.book_title, book.book_cover_url, authors.author_name,
          user_library.is_favorite, user_library.read_status, user_library.added_to_shelf_at,
          book.created_at,
          (book.added_by_user_id = $1) as added_by_me
       FROM book
       JOIN authors ON authors.author_id = book.author_id
       LEFT JOIN user_library ON user_library.book_id = book.book_id AND user_library.user_id = $1
       WHERE book.added_by_user_id = $1 OR user_library.user_id = $1
       ORDER BY user_library.added_to_shelf_at DESC NULLS LAST, book.created_at DESC`,
      [me.user_id]
    );
    res.json({ books: rows });
  } catch (err) {
    console.error("bookshelf/mine error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/api/library/favorite", requireAuth, async (req, res) => {
  const me = req.user;
  const { book_id } = req.body;

  if (!book_id || typeof book_id !== "number") {
    return res.status(400).json({ error: "Valid book_id is required" });
  }

  try {
    await pool.query(
      `INSERT INTO user_library (user_id, book_id, is_favorite) 
       VALUES ($1, $2, true)
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET is_favorite = NOT user_library.is_favorite`,
      [me.user_id, book_id]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("favorite error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/api/library/status", requireAuth, async (req, res) => {
  const me = req.user;
  const { book_id, read_status } = req.body;

  if (!book_id || typeof book_id !== "number") {
    return res.status(400).json({ error: "Valid book_id is required" });
  }

  if (!["read", "reading", "want_to_read"].includes(read_status)) {
    return res.status(400).json({ error: "Invalid read status" });
  }

  try {
    await pool.query(
      `INSERT INTO user_library (user_id, book_id, read_status)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, book_id)
      DO UPDATE SET read_status = $3`,
      [me.user_id, book_id, read_status]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("status error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/api/books/:book_id/reviews", async (req, res) => {
  const { book_id } = req.params;
  try {
    // Get book details
    const bookResult = await pool.query(
      `SELECT book.book_title, book.book_cover_url, authors.author_name
       FROM book
       JOIN authors ON authors.author_id = book.author_id
       WHERE book.book_id = $1`,
      [book_id]
    );

    if (bookResult.rows.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    // Get reviews
    const reviewsResult = await pool.query(
      `SELECT reviews.review_text, reviews.rating, reviews.created_at, users.user_email
       FROM reviews
       JOIN users ON users.user_id = reviews.user_id
       WHERE reviews.book_id = $1
       ORDER BY reviews.created_at DESC`,
      [book_id]
    );

    res.json({
      book: bookResult.rows[0],
      reviews: reviewsResult.rows
    });
  } catch (err) {
    console.error("book reviews error:", err);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/api/books/full", requireAuth, async (req, res) => {
  const me = req.user;
  const client = await pool.connect();
  const {
    book_title,
    author_name,
    book_cover_url,
    book_summary,
    review_text,
    rating,
    isbn,
    data_source,
  } = req.body;

  if (!book_title || !author_name || !review_text) {
    client.release();
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    await client.query("BEGIN");

    // Check for duplicate by ISBN first (if provided)
    if (isbn) {
      const isbnCheck = await client.query(
        `SELECT book_id FROM book WHERE isbn = $1`,
        [isbn]
      );
      if (isbnCheck.rows.length > 0) {
        const existingBookId = isbnCheck.rows[0].book_id;

        // Check if user already reviewed this book
        const reviewCheck = await client.query(
          `SELECT review_id FROM reviews WHERE user_id = $1 AND book_id = $2`,
          [me.user_id, existingBookId]
        );

        if (reviewCheck.rows.length > 0) {
          await client.query("ROLLBACK");
          client.release();
          return res.status(409).json({
            error: "You have already reviewed this book.",
            book_id: existingBookId
          });
        }

        // Add review to existing book
        const reviewResult = await client.query(
          `INSERT INTO reviews (user_id, book_id, review_text, rating)
          VALUES($1, $2, $3, $4)
          RETURNING *`,
          [me.user_id, existingBookId, review_text, rating]
        );

        await client.query("COMMIT");
        client.release();
        return res.status(201).json({
          book: { book_id: existingBookId },
          review: reviewResult.rows[0],
          message: "Review added to existing book"
        });
      }
    }

    const authorResult = await client.query(
      `INSERT INTO authors (author_name)
      VALUES ($1)
      ON CONFLICT (author_name) DO UPDATE SET author_name = EXCLUDED.author_name
      RETURNING author_id`,
      [author_name]
    );

    const author_id = authorResult.rows[0].author_id;

    const bookResult = await client.query(
      `INSERT INTO book (book_title, author_id, book_cover_url, book_summary, isbn, data_source, added_by_user_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (book_title, author_id) DO NOTHING
      RETURNING book_id`,
      [
        book_title,
        author_id,
        book_cover_url ?? null,
        book_summary ?? null,
        isbn ?? null,
        data_source ?? 'user',
        me.user_id,
      ]
    );

    let book_id;
    if (bookResult.rows.length === 0) {
      const existing = await client.query(
        `SELECT book_id FROM book WHERE book_title = $1 AND author_id = $2`,
        [book_title, author_id]
      );
      book_id = existing.rows[0].book_id;
    } else {
      book_id = bookResult.rows[0].book_id;
    }

    const reviewResult = await client.query(
      `INSERT INTO reviews (user_id, book_id, review_text, rating)
      VALUES($1, $2, $3, $4)
      RETURNING *`,
      [me.user_id, book_id, review_text, rating]
    );

    await client.query("COMMIT");

    res.status(201).json({
      author: authorResult.rows[0],
      book: { book_id },
      review: reviewResult.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Transaction failed:", error);
    res.status(500).json({ error: "Transaction failed, rolled back." });
  } finally {
    client.release();
  }
});

app.post("/api/users/register", async (req, res) => {
  try {
    const email = String(req.body?.user_email ?? "")
      .trim()
      .toLowerCase();
    const password = String(req.body?.password ?? "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }
    if (password.length < 12) {
      return res
        .status(400)
        .json({ error: "Password must be at least 12 characters." });
    }

    const hash = await bcrypt.hash(password, ROUNDS);
    const { rows } = await pool.query(
      "INSERT INTO users (user_email, password) VALUES ($1, $2) RETURNING *",
      [email, hash]
    );

    const user = rows[0];

    req.login(user, (err) => {
      if (err) return res.status(201).json({ user });
      return res.status(201).json({ user });
    });
  } catch (err) {
    if (err.code === "23505") {
      return res
        .status(409)
        .json({ error: "Email already registered. Try logging in." });
    }
    console.error("Register error:", err);
    return res.status(500).json({ error: "Internal server error." });
  }
});

//server call to get the user when logging in.

app.post("/api/users/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res
        .status(401)
        .json({ error: info?.message || "Invalid email or password." });
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

app.get("/api/me", (req, res) => {
  return res.json({ user: req.user ?? null });
});

app.post("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ error: "Logout failed." });
    req.session.destroy(() => res.status(204).end());
  });
});

passport.use(
  new LocalStrategy(
    { usernameField: "user_email", passwordField: "password" },
    async (email, password, done) => {
      try {
        const normEmail = String(email || "")
          .trim()
          .toLowerCase();
        if (!normEmail || !password) {
          return done(null, false, {
            message: "Email and password are required.",
          });
        }

        const { rows } = await pool.query(
          `SELECT user_id, user_email, password FROM  users WHERE  user_email = $1`,
          [normEmail]
        );
        const user = rows[0];
        if (!user) {
          return done(null, false, {
            message: "Invalid Email or Password",
          });
        }

        const hash = user.password;
        const ok = await bcrypt.compare(password, hash);
        if (!ok) {
          return done(null, false, { message: "Invalid Email or Password" });
        }

        return done(null, {
          user_id: user.user_id,
          user_email: user.user_email,
        });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query(
      `SELECT user_id, user_email FROM users WHERE user_id = $1`,
      [id]
    );
    const user = rows[0] ?? null;
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
