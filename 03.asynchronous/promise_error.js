import sqlite3 from "sqlite3";

const db = new sqlite3.Database(":memory:");

function runPromise(db, query) {
  return new Promise((resolve, reject) => {
    db.run(query, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function allPromise(db, query) {
  return new Promise((resolve, reject) => {
    db.all(query, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

runPromise(
  db,
  "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
)
  .then(() => {
    console.log("Table created.");
    return runPromise(db, "INSERT INTO books (title) VALUES (NULL)");
  })
  .catch((err) => {
    console.error("Insert error", err);
    return allPromise(db, "SELECT * FROM names");
  })
  .catch((err) => {
    console.error("Select error", err);
    return runPromise(db, "DROP TABLE books");
  })
  .then(() => {
    console.log("Table dropped");
    db.close();
  })
  .catch((err) => {
    console.error("Error: ", error);
  });
