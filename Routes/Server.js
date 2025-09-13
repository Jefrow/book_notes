import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "library",
  password: "admin",
  port: 5432,
});

db.connect();

app.use(cors());
app.use(express.json());

//get request that pulls the
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM book ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

//post request to add data to the the books library
app.post("/", async (req, res) => {
  const { title, author, rating, review, created_by, isbn, cover_url } =
    req.body;

  try {
    const cover_url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;

    const result = await db.query(
      `INSERT INTO book (title, author, rating, review, cover_url, created_by)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *`,
      [title, author, rating, review, cover_url, created_by]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error adding book" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
