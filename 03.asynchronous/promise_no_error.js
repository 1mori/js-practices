import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("booksテーブルを作成しました");
    return runPromise(db, "INSERT INTO books (title) VALUES ('Git入門')");
  })
  .then((result) => {
    console.log(
      `bookテーブルに本のタイトルを追加しました 自動採番されたID: ${result.lastID}`,
    );
    return allPromise(db, "SELECT * FROM books");
  })
  .then((rows) => {
    console.log(`取得したレコード: ${JSON.stringify(rows)}`);
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("booksテーブルを削除しました");
    return closePromise(db);
  })
  .then(() => {
    console.log("データベースが切断されました");
  });
