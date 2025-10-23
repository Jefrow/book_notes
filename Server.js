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
const port = 3000;
const ROUNDS = Number(process.env.BCRYPT_COST ?? 12);
const PgSession = pgSessionFactory(session);

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Library",
  password: "admin",
  port: 5432,
});

app.set("trust proxy", 1);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    store: new PgSession({ pool }),
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 8,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

//get request that fetches the books from the book table.

function requireAuth(req, res, next) {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ error: "Login required" });
  }
  next();
}

//"Mine" endpoints (use session user)
app.get("/api/reviews/mine", requireAuth, async (req, res) => {
  const me = req.user;
  const { rows } = await pool.query(
    `SELECT book.book_title, book.book_cover_url, author.author_name, reviews.reviews_text review.reviews.rating
    FROM reviews
    JOIN book ON book.book_id = reviews.book_id
    Join authors ON authors.author_id = book.author_id
    WHERE reviews.user_id = $1`[me.user_id]
  );
  res.json({ reviews: rows });
});

app.get("/api/books/mine", requireAuth, async (req, res) => {
  const me = req.user;
  const { rows } = await pool.query(
    `SELECT book.book_id, book.book_title, book.book_cover_url, authors.author_name,
    From book 
    JOIN authors ON authors.author_id = book.author_id
    WHERE book.created_by = $1`[me.user_id]
  );
  res.json({ books: rows });
});

app.get("/api/books", async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT book.book_title, book.book_cover_url, authors.author_name
      FROM book
      INNER JOIN authors ON book.author_id = authors.author_id`
    );
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching book:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.get("/api/users/:user_id/reviews", async (req, res) => {
  const { user_id } = req.params;

  try {
    const result = await pool.query(
      `SELECT book.book_title, book.book_cover_url, authors.author_name, reviews.review_text, reviews.rating
      From reviews
      INNER JOIN book ON book.book_id = reviews.book_id
      INNER JOIN authors ON book.author_id = authors.author_id
      Where reviews.user_id = $1`,
      [user_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.log("Error fetching user reviews:", error);
    res.status(500).json({ error: "Internal Server Error." });
  }
});

app.post("/api/books/full", async (req, res) => {
  const client = await pool.connect();
  const {
    book_title,
    author_name,
    book_cover_url,
    book_summary,
    user_id,
    review_text,
    rating,
  } = req.body;

  try {
    await client.query("BEGIN");

    const authorResult = await client.query(
      `INSERT INTO authors (author_name) 
      VALUES ($1)
      ON CONFLICT (author_name) DO UPDATE SET author_name = EXCLUDED.author_name
      RETURNING author_id`,
      [author_name]
    );

    const author_id = authorResult.rows[0].author_id;

    const bookResult = await client.query(
      `INSERT INTO book (book_title, author_id, book_cover_url, book_summary)
      VALUES ($1, $2, $3, $4)
      RETURNING book_id`,
      [book_title, author_id, book_cover_url ?? null, book_summary ?? null]
    );

    const book_id = bookResult.rows[0].book_id;

    const reviewResult = await client.query(
      `INSERT INTO reviews (user_id, book_id, review_text, rating)
      VALUES($1, $2, $3, $4)
      RETURNING *`,
      [user_id, book_id, review_text, rating]
    );

    await client.query("COMMIT");

    res.status(201).json({
      author: authorResult.rows[0],
      book: bookResult.rows[0],
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

    req.login(rows[0], (err) => {
      if (err) return res.status(201).json({ user: rows[o] });
      return res.status(201).json({ user: result.rows[0] });
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

app.post("/api/users/login", passport.authenticate("local"), (req, res) => {
  return res.status(200).json({ user: req.user });
});

app.post("/api/users/login", async (req, res) => {
  try {
    const email = String(req.body?.user_email ?? "")
      .trim()
      .toLowerCase();
    let loginPassword = String(req.body?.password ?? "");

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const result = await pool.query(
      `SELECT user_id, user_email, password FROM users WHERE user_email = $1`,
      [email]
    );

    if (result.rows.length > 0) {
      const user = result.rows[0];
      const storedHash = user.password;

      bcrypt.compare(loginPassword, storedHash, (err, result) => {
        if (err) {
          return res.status(401).json({ error: "Invalid email or password." });
          //do something,...In a regular ejs this would send "Error comparing password."
        } else {
          if (result) {
            return res.status(200).json({
              user: {
                user_id: user.user_id,
                user_email: user.user_email,
              },
            });
          }
        }
      });
    } else {
      return res.status(401).json({ error: "User not found." });
      //send "User not found."
    }
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error." });
    //send error to catch.
  }
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
  new LocalStrategy(localFields, async (email, password, done) => {
    try {
      const normEmail = String(email ?? "")
        .trim()
        .toLowerCase();
      if (!normEmail || !password) {
        return done(null, false, {
          message: "Email and password are required.",
        });
      }

      const { rows } = await pool.query(
        `SELECT user_id, user_email, password
      FROM users
      WHERE user_email = $1`,
        [normEmail]
      );

      const user = rows[0];

      const hashToCheck = user?.passord;
      const ok = await bcrypt.compare(password, hashToCheck);

      if (!user || !ok) {
        return done(null, false, { message: "Invalid email or password." });
      }

      return done(null, { user_id: user.user_id, user_email: user.user_email });
    } catch (err) {
      return done(err);
    }
  })
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
