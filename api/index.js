const express = require("express");
const cors = require("cors");

const db = require("better-sqlite3")("../dataStore/data.db");
db.pragma("journal_mode = WAL");

const app = express();

const PORT = process.env.PORT || 80;

app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(cors()); // Enable CORS for all routes

app.get("/api", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const row = db
    .prepare("SELECT * FROM jobs WHERE last_date >= ? ORDER BY date_added DESC")
    .all(today);
  res.json(row);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
