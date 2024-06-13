#!/usr/bin/env node

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";
import inquirer from "inquirer";

import dbPromise from "./db_utils.js";

class MemoApp {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.memoDatabase = new memoDatabase();
  }

  async #add() {
    const input = await new readlineInterface().inputText();
    this.memoDatabase.insert(input);
  }

  async #list() {
    const memos = await this.memoDatabase.all();

    memos.forEach((memo) => {
      console.log(memo.text.split("\n")[0]);
    });
  }

  async #read() {
    const memoRows = await this.memoDatabase.all();
    if (memoRows.length === 0) {
      console.log("表示するメモがありません。");
      return;
    }

    const answer = await this.#choose(
      memoRows,
      "memoToRead",
      "list",
      "Choose a memo you want to see:",
    );

    const selectedText = answer.memoToRead.text;
    if (selectedText) {
      console.log(`\n${selectedText}`);
    }
  }

  async #delete() {
    const memoRows = await this.memoDatabase.all();
    if (memoRows.length === 0) {
      console.log("削除するメモがありません。");
      return;
    }
    const answer = await this.#choose(
      memoRows,
      "memoToDelete",
      "list",
      "Choose a memo you want to delete:",
    );

    const id = answer.memoToDelete.id;
    this.memoDatabase.delete(id);
  }

  async #choose(memoRows, name, type, message) {
    const choices = memoRows.map((memoRow) => ({
      name: memoRow.text.split("\n")[0],
      value: memoRow,
    }));

    const answer = await inquirer.prompt([{ name, type, message, choices }]);

    return answer;
  }

  async run() {
    if (this.option.l) {
      await this.#list();
    } else if (this.option.r) {
      await this.#read();
    } else if (this.option.d) {
      await this.#delete();
    } else {
      await this.#add();
    }
    await closeDatabase(this.db);
  }
}

class memoDatabase {
  constructor() {
    this.db = new sqlite3.Database("./memo.sqlite3");
    this.createTable();
  }
  async createTable() {
    try {
      await promise.run(
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
    let memoRows;
    try {
      memoRows = await promise.all(this.db, "SELECT id, text FROM memo");
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_ERROR") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
    return memoRows;
  }

  async insert(input) {
    try {
      await promise.run(this.db, "INSERT INTO memo (text) VALUES (?)", [input]);
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
      await promise.run(this.db, "DELETE FROM memo WHERE id = ?", [id]);
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
      await promise.close(db);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_MISUSE") {
        console.error(err.message);
      } else {
        throw err;
      }
    }
  }
}

class readlineInterface {
  constructor() {
    this.readlineInterface = createInterface({ input: stdin, output: stdout });
  }

  inputText() {
    return new Promise((resolve) => {
      let text = "";
      this.readlineInterface.on("line", (line) => {
        text += `${line}\n`;
      });

      this.readlineInterface.on("close", () => {
        resolve(text);
      });
    });
  }
}

const promise = new dbPromise();
const app = new MemoApp();
app.run();
