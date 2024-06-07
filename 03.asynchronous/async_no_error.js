import sqlite3 from "sqlite3";
import { runPromise, allPromise, closePromise } from "./db_utils.js";

const db = new sqlite3.Database(":memory:");

await runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
);
console.log("booksテーブルを作成しました");

const result = await runPromise(
  db,
  "INSERT INTO books (title) VALUES ('Git入門')",
);
console.log(
  `booksテーブルに本のタイトルを追加しました 自動採番されたID: ${result.lastID}`,
);

const rows = await allPromise(db, "SELECT * FROM books");
console.log(`取得したレコード: ${JSON.stringify(rows)}`);

await runPromise(db, "DROP TABLE books");
console.log("booksテーブルを削除しました");

await closePromise(db);
console.log("データベースコネクションが切断されました");
