import sqlite3 from "sqlite3";

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  ensureTableExists() {
    const query =
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)";
    return new Promise((resolve) => {
      this.db.run(query, (err) => this.#handleError(err, resolve, this));
    });
  }

  fetchAll() {
    const query = "SELECT id, text FROM memos ORDER BY id";
    return new Promise((resolve) => {
      this.db.all(query, (err, rows) => this.#handleError(err, resolve, rows));
    });
  }

  insert(text) {
    const query = "INSERT INTO memos (text) VALUES (?)";
    return new Promise((resolve) => {
      this.db.run(query, text, (err) => this.#handleError(err, resolve, this));
    });
  }

  delete(id) {
    const query = "DELETE FROM memos WHERE id = ?";
    return new Promise((resolve) => {
      this.db.run(query, id, (err) => this.#handleError(err, resolve, this));
    });
  }

  close() {
    return new Promise((resolve) => {
      this.db.close((err) => this.#handleError(err, resolve, this));
    });
  }

  #handleError(err, resolve, result) {
    if (err) {
      throw err;
    } else {
      resolve(result);
    }
  }
}

export default MemoDatabase;
