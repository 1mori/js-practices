import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    (err) => {
      if (err) {
        console.error("Table create error", err);
        return;
      }
      console.log("Table created");

      db.run("INSERT INTO books (title) VALUES ('あいうえお')", function (err) {
        if (err) {
          console.error("Insert error", err);
          return;
        }
        console.log("Insert book title with ID", this.lastID);

        // 非NULLなカラムなので、NULLを挿入してみようとしてみる
        db.run("INSERT INTO books (title) VALUES (NULL)", function (err) {
          if (err) {
            console.error("Insert error", err);
          }

          // 存在しないテーブルの名前を指定してみる
          db.all("SELECT * FROM names", (err) => {
            if (err) {
              console.error("Select error", err);
            }

            db.run("DROP TABLE books", (err) => {
              if (err) {
                console.log("Drop error", err);
                return;
              }
              console.log("Table dropped");
              db.close();
            });
          });
        });
      });
    },
  );
});
