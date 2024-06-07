import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("booksテーブルを作成しました");

    // 非NULLなカラムなので、NULLを挿入してみようとしてみる
    db.run("INSERT INTO books (title) VALUES (NULL)", function (err) {
      console.error(err.message);

      // 存在しないテーブルの名前を指定してみる
      db.all("SELECT * FROM names", (err) => {
        console.error(err.message);

        db.run("DROP TABLE books", () => {
          console.log("booksテーブルを削除しました");

          db.close(() => {
            console.log("データベースコネクションが切断されました");
          });
        });
      });
    });
  },
);
