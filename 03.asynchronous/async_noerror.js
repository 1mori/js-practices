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

const asynchronous = async () => {
  try {
    await runPromise(
      db,
      "CREATE TABLE books (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL UNIQUE)",
    );
    console.log("Table created");

    const result = await runPromise(
      db,
      "INSERT INTO books (title) VALUES ('あいうえお')",
    );
    console.log("Insert book title with ID", result.lastID);

    const rows = await allPromise(db, "SELECT * FROM books");
    console.log("Rows: ", rows);

    await runPromise(db, "DROP TABLE books");
    console.log("Table dropped");
  } catch (err) {
    console.error("Error: ", error);
  } finally {
    db.close();
  }
};

asynchronous();
