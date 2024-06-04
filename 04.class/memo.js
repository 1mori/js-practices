#!/usr/bin/env node

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";

import { runPromise, allPromise, closePromise } from "./db_utils.js";

class MemoApp {
  constructor() {
    this.argv = minimist(process.argv.slice(2));
    this.rl = readline.createInterface({ input, output });
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  add() {
    let inputText = "";

    rl.on("line", (line) => {
      inputText += line + "\n";
    });
    rl.on("close", async () => {
      try {
        await runPromise(this.db, "INSERT INTO memo (text) VALUES (?)", [inputText]);
      } catch (err) {
        console.error("Insert error: ", err);
      } finally {
        await this.closeDatabase();
      }
    });
  }

  async list() {}

  async read() {}

  async delete() {}
}

rl.on("close", async () => {
  try {
    await runPromise(db, "INSERT INTO memo (text) VALUES (?)", [inputText]);
  } catch (err) {
    console.error("Insert error: ", err);
  }

  try {
    const rows = await allPromise(db, "SELECT text from memo");
    for (const row of rows) {
      console.log(row["text"]);
    }
  } catch (err) {
    console.error("Select error: ", err);
  }

  try {
    await closePromise(db);
  } catch (err) {
    console.error("Close error: ", err);
  }
});
