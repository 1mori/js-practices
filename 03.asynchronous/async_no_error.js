import sqlite3 from "sqlite3";
import { runPromise, allPromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

const asynchronous = async () => {
  try {
    await runPromise(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    console.log("Create table");

    const result = await runPromise(
      db,
      "INSERT INTO books (title) VALUES ('あいうえお')",
    );
    console.log("Insert book title with ID", result.lastID);

    const rows = await allPromise(db, "SELECT * FROM books");
    console.log("Rows: ", rows);

    await runPromise(db, "DROP TABLE books");
    console.log("Table dropped");
  } catch (err) {
    console.error("Error: ", err);
  } finally {
    db.close();
  }
};

asynchronous();
