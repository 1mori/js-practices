#!/usr/bin/env node

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";
import inquirer from "inquirer";

import { runPromise, allPromise, closePromise } from "./db_utils.js";

async function closeDatabase(db) {
  try {
    await closePromise(db);
  } catch (err) {
    if (err instanceof Error) console.error(err.message);
    else throw err;
  }
}

class MemoApp {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.readlineInterface = createInterface({ input: stdin, output: stdout });
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  async #add() {
    let inputText = "";

    this.readlineInterface.on("line", (line) => {
      inputText += `${line}\n`;
    });
    this.readlineInterface.on("close", async () => {
      try {
        await runPromise(this.db, "INSERT INTO memo (text) VALUES (?)", [
          inputText,
        ]);
      } catch (err) {
        if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
          console.error(err.message);
        }
      }
    });
    await closeDatabase(this.db);
  }

  async #list() {
    try {
      const rows = await allPromise(this.db, "SELECT text FROM memo");
      rows.forEach((row) => {
        console.log(row["text"].split("\n")[0]);
      });
    } catch (err) {
      console.error(`Select error: ${err}`);
    } finally {
      await closeDatabase(this.db);
      this.readlineInterface.close();
    }
  }

  async #read() {
    try {
      const rows = await allPromise(this.db, "SELECT id, text FROM memo");

      const choices = rows.map((row) => ({
        name: row.text.split("\n")[0],
        value: row.id,
      }));

      const answers = await inquirer.prompt([
        {
          name: "memoToRead",
          type: "list",
          message: "Choose a memo you want to read:",
          choices: choices,
        },
      ]);

      const memoIdToRead = answers.memoToRead;
      const selectedMemo = rows.find((row) => row.id === memoIdToRead);
      if (selectedMemo) {
        console.log("\n" + selectedMemo.text);
      }
    } catch (err) {
      console.error(`Select error: ${err}`);
    } finally {
      await closeDatabase(this.db);
      this.readlineInterface.close();
    }
  }

  async #delete() {
    try {
      const rows = await allPromise(this.db, "SELECT id, text FROM memo");

      const choices = rows.map((row) => ({
        name: row.text.split("\n")[0],
        value: row.id,
      }));

      const answers = await inquirer.prompt([
        {
          name: "memoToDelete",
          type: "list",
          message: "Choose a memo you want to delete:",
          choices: choices,
        },
      ]);

      const memoIdToDelete = answers.memoToDelete;
      await runPromise(this.db, "DELETE FROM memo WHERE id = ?", [
        memoIdToDelete,
      ]);
      console.log("Memo deleted.");
    } catch (err) {
      console.error(`Delete error: ${err}`);
    } finally {
      await closeDatabase(this.db);
      this.readlineInterface.close();
    }
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
  }
}

const app = new MemoApp();
app.run();
