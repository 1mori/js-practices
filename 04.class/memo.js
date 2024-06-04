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

    this.rl.on("line", (line) => {
      inputText += line + "\n";
    });
    this.rl.on("close", async () => {
      try {
        await runPromise(this.db, "INSERT INTO memo (text) VALUES (?)", [
          inputText,
        ]);
      } catch (err) {
        console.error("Insert error: ", err);
      } finally {
        await this.closeDatabase();
      }
    });
  }

  async list() {
    try {
      const rows = await allPromise(this.db, "SELECT text FROM memo");
      rows.forEach((row) => {
        console.log(row["text"].split("\n")[0]);
      });
    } catch (err) {
      console.error("Select error: ", err);
    } finally {
      await this.closeDatabase();
    }
  }

  async read() {}

  async delete() {}

  async closeDatabase() {
    try {
      await closePromise(this.db);
    } catch (err) {
      console.error("Close error: ", err);
    }
  }

  async run() {
    if (this.argv.l) {
      await this.list();
    } else {
      this.add();
    }
  }
}

const app = new MemoApp();
app.run();
