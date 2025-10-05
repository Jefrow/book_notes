import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

const { Pool } = pg;

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "Library",
  password: "admin",
  port: 5432,
});

app.use(cors());
app.use(express.json());

//get request that fetches the books from the book table.
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
    res.status(500).json({ error: "Could not fetch books" });
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
    res.status(500).json({ error: "Could not fetch reviews" });
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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
