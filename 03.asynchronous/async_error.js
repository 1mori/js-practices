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
  if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
    console.error(err.message);
  } else {
    throw err;
  }
}

try {
  await allPromise(db, "SELECT * FROM names");
} catch (err) {
  if (err instanceof Error && err.code === "SQLITE_ERROR") {
    console.error(err.message);
  } else {
    throw err;
  }
}

await runPromise(db, "DROP TABLE books");
console.log("Table drop completed successfully");

await closePromise(db);
console.log("Database connection closed");
