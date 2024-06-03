import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

db.serialize(() => {
  db.run(
    "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    (err) => {
      console.log("Table created");

      db.run("INSERT INTO books (title) VALUES ('あいうえお')", function (err) {
        console.log("Insert book title with ID", this.lastID);

        db.all("SELECT * FROM books", (err, rows) => {
          console.log("Rows :", rows);

          db.run("DROP TABLE books", (err) => {
            console.log("Table dropped");
            db.close();
          });
        });
      });
    },
  );
});
