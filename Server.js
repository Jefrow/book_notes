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
  database: "Library",
  password: "admin",
  port: 5432,
});

app.use(cors());
app.use(express.json());

db.connect();

//get request that pulls the
app.get("/api/books", async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM book ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.log(error);
  }
});

//post request to add data to the the books library
app.post("/api/books", async (req, res) => {
  const { title, author, rating, cover_url } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO book (title, author, rating, cover_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *`,
      [title, author, rating, cover_url ?? null]
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
