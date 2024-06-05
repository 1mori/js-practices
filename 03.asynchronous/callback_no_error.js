import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.run(
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
  () => {
    console.log("Table creation completed successfully");

    db.run("INSERT INTO books (title) VALUES ('Git入門')", function () {
      console.log("Insert book title with ID", this.lastID);

      db.all("SELECT * FROM books", (_, rows) => {
        console.log("Rows: ", rows);

        db.run("DROP TABLE books", () => {
          console.log("Table drop completed successfully");

          db.close(() => {
            console.log("Closed database");
          });
        });
      });
    });
  },
);
