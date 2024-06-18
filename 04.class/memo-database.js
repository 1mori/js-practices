import sqlite3 from "sqlite3";

import DbPromise from "./db_utils.js";

class MemoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
    this.promise = new DbPromise();
  }

  async ensureTableExists() {
    try {
      await this.promise.run(
        this.db,
        "CREATE TABLE IF NOT EXISTS memos (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT NOT NULL)",
      );
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async all() {
    let memos;
    try {
      memos = await this.promise.all(
        this.db,
        "SELECT id, text FROM memos ORDER BY id",
      );
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
    return memos;
  }

  async insert(memo) {
    try {
      await this.promise.run(this.db, "INSERT INTO memos (text) VALUES (?)", [
        memo,
      ]);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async delete(id) {
    try {
      await this.promise.run(this.db, "DELETE FROM memos WHERE id = ?", [id]);
      console.log("Memo deleted.");
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }

  async close() {
    try {
      await this.promise.close(this.db);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_MISUSE") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }
}

export default MemoDatabase;
