import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("Table creation completed successfully");

    // 非NULLなカラムなので、NULLを挿入してみようとしてみる
    db.run("INSERT INTO books (title) VALUES (NULL)", function (err) {
      if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
        console.error(err.message);
      } else {
        throw err;
      }

      // 存在しないテーブルの名前を指定してみる
      db.all("SELECT * FROM names", (err) => {
        if (err instanceof Error && err.code === "SQLITE_ERROR") {
          console.error(err.message);
        } else {
          throw err;
        }

        db.run("DROP TABLE books", () => {
          console.log("Table drop completed successfully");

          db.close(() => {
            console.log("Database connection closed");
          });
        });
      });
    });
  },
);
