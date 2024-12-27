import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import cors from "cors";

import env from "dotenv";

env.config();

const app = express();
const port = 5000;

const db = new pg.Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.PROCESS,
  password: process.env.PASSWORD,
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

app.post("/notes", async (req, res) => {
  const title = req.body.title;
  const content = req.body.content;

  try {
    const result = await db.query(
      "INSERT INTO notes (title,content) VALUES ($1,$2) RETURNING*",
      [title, content]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
});

app.get("/notes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
});

app.delete("/notes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const deleteTodo = await pool.query("DELETE FROM notes WHERE id = $1", [
      id,
    ]);
    res.json("Note was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
