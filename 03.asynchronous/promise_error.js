import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("booksテーブルを作成しました");
    return runPromise(db, "INSERT INTO books (title) VALUES (NULL)");
  })
  .catch((err) => {
    if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
      console.error(err.message);
    } else {
      throw err;
    }
    return allPromise(db, "SELECT * FROM names");
  })
  .catch((err) => {
    if (err instanceof Error && err.code === "SQLITE_ERROR") {
      console.error(err.message);
    } else {
      throw err;
    }
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("booksテーブルを削除しました");
    return closePromise(db);
  })
  .then(() => {
    console.log("データベースが切断されました");
  });
