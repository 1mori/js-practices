import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("Table creation completed successfully");
    return runPromise(db, "INSERT INTO books (title) VALUES ('Git入門')");
  })
  .then((result) => {
    console.log(`Book title inserted with ID ${this.lastID}`);
    return allPromise(db, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log(`Retrieved rows: ${JSON.stringify(rows)}`);
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("Table drop completed successfully");
    return closePromise(db);
  })
  .then(() => {
    console.log("Database connection closed");
  });
