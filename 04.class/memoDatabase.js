import sqlite3 from "sqlite3";

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  ensureTableExists() {
    const query =
      "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)";
    return this.#runQuery(query);
  }

  fetchAll() {
    const query = "SELECT id, text FROM memos ORDER BY id";
    return this.#allQuery(query);
  }

  insert(text) {
    const query = "INSERT INTO memos (text) VALUES (?)";
    return this.#runQuery(query, text);
  }

  delete(id) {
    const query = "DELETE FROM memos WHERE id = ?";
    return this.#runQuery(query, id);
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  #runQuery(query, ...params) {
    return new Promise((resolve, reject) => {
      this.db.run(query, params, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve(this);
        }
      });
    });
  }

  #allQuery(query, ...params) {
    return new Promise((resolve, reject) => {
      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

export default MemoDatabase;
