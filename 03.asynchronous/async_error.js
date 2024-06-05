import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
console.log("Table creation completed successfully");

try {
  await runPromise(db, "INSERT INTO books (title) VALUES (NULL)");
} catch (err) {
  console.error("Insert error", err);
}

try {
  await allPromise(db, "SELECT * FROM names");
} catch (err) {
  console.error("Select error", err);
}

await runPromise(db, "DROP TABLE books");
console.log("Table dropped");

await closePromise(db);
console.log("Closed database");
