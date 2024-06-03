import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
console.log("Create table");

try {
  await runPromise(db, "INSERT INTO books (title) VALUES (NULL)");
  console.log("Insert book title with ID", this.lastID);
} catch (err) {
  console.error("Insert error", err);
}

try {
  const rows = await allPromise(db, "SELECT * FROM names");
  console.log("Rows: ", rows);
} catch (err) {
  console.error("Select error", err);
}

await runPromise(db, "DROP TABLE books");
console.log("Table dropped");

db.close();
console.log("Closed database");
