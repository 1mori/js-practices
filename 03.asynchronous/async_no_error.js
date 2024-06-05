import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
console.log("Table creation completed successfully");

const result = await runPromise(
  db,
  "INSERT INTO books (title) VALUES ('Git入門')",
);
console.log(`Book title inserted with ID ${result.lastID}`);

const rows = await allPromise(db, "SELECT * FROM books");
console.log(`Retrieved rows: ${JSON.stringify(rows)}`);

await runPromise(db, "DROP TABLE books");
console.log("Table drop completed successfully");

await closePromise(db);
console.log("Database connection closed");
