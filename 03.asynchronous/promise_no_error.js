import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("Create Table");
    return runPromise(db, "INSERT INTO books (title) VALUES ('Git入門')");
  })
  .then((result) => {
    console.log("Insert book title with ID", result.lastID);
    return allPromise(db, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log("Rows: ", rows);
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("Table dropped");
    db.close();
  })
  .catch((err) => {
    console.error("Error: ", err);
  });
