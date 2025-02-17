const express = require("express");
const cors = require("cors");

const db = require("better-sqlite3")("../dataStore/data.db");
db.pragma("journal_mode = WAL");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());

app.get("/api/jobs", (req, res) => {
  const today = new Date().toISOString().split("T")[0];
  const row = db
    .prepare("SELECT * FROM jobs WHERE last_date >= ? ORDER BY date_added DESC")
    .all(today);

  res.json(row);
});

app.get("/api/jobs/stats", (req, res) => {
  const row = db
    .prepare(
      "SELECT count(job_id) AS newJobs, date_added as date from jobs GROUP BY date(date_added)"
    )
    .all();

  res.json(row);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
