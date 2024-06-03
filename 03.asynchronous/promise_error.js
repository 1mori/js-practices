import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("Create table");
    return runPromise(db, "INSERT INTO books (title) VALUES (NULL)");
  })
  .catch((err) => {
    console.error("Insert error", err);
    return allPromise(db, "SELECT * FROM names");
  })
  .catch((err) => {
    console.error("Select error", err);
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("Table dropped");
    return closePromise(db);
  }).then(() => {
    console.log("Closed database");
  })
  .catch((err) => {
    console.error("Error: ", err);
  });
