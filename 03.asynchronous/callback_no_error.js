import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("booksテーブルを作成しました");

    db.run("INSERT INTO books (title) VALUES ('Git入門')", function () {
      console.log(
        `bookテーブルに本のタイトルを追加しました 自動採番されたID: ${this.lastID}`,
      );

      db.all("SELECT * FROM books", (_, rows) => {
        console.log(`取得したレコード: ${JSON.stringify(rows)}`);

        db.run("DROP TABLE books", () => {
          console.log("booksテーブルを削除しました");

          db.close(() => {
            console.log("データベースが切断されました");
          });
        });
      });
    });
  },
);
