import sqlite3 from "sqlite3";

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  ensureTableExists() {
    const query =
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)";
    return new Promise((resolve) => {
      this.db.run(query, (err) => {
        if (err) {
          throw err;
        } else {
          resolve(this);
        }
      });
    });
  }

  fetchAll() {
    const query = "SELECT id, text FROM memos ORDER BY id";
    return new Promise((resolve) => {
      this.db.all(query, (err, rows) => {
        if (err) {
          throw err;
        } else {
          resolve(rows);
        }
      });
    });
  }

  insert(text) {
    const query = "INSERT INTO memos (text) VALUES (?)";
    return new Promise((resolve) => {
      this.db.run(query, text, (err) => {
        if (err) {
          throw err;
        } else {
          resolve(this);
        }
      });
    });
  }

  delete(id) {
    const query = "DELETE FROM memos WHERE id = ?";
    return new Promise((resolve) => {
      this.db.run(query, id, function (err) {
        if (err) {
          throw err;
        } else {
          resolve(this);
        }
      });
    });
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          throw err;
        } else {
          resolve(this);
        }
      });
    });
  }
}

export default MemoDatabase;
