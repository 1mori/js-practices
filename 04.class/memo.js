#!/usr/bin/env node

import { createInterface } from "node:readline";
import { stdin, stdout } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";
import inquirer from "inquirer";

import { runPromise, allPromise, closePromise } from "./db_utils.js";
import { resolve } from "node:path";

async function closeDatabase(db) {
  try {
    await closePromise(db);
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_MISUSE")
      console.error(err.message);
    else throw err;
  }
}

async function getMemoRows(db) {
  let memoRows;
  try {
    memoRows = await allPromise(db, "SELECT text FROM memo");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR")
      console.error(err.message);
    else throw err;
  }
  return memoRows;
}

async function chooseMemo(memoRows, name, type, message) {
  const choices = memoRows.map((row) => ({
    name: row.text.split("\n")[0],
    value: row.text,
  }));

  const answers = await inquirer.prompt([{ name, type, message, choices }]);

  return answers;
}

class MemoApp {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.db = new sqlite3.Database("./memo.sqlite3");
  }

  async #add() {
    let inputText = "";
    const readlineInterface = createInterface({ input: stdin, output: stdout });

    await new Promise((resolve) => {
      readlineInterface.on("line", (line) => {
        inputText += `${line}\n`;
      });

      readlineInterface.on("close", resolve);
    });

    try {
      await runPromise(this.db, "INSERT INTO memo (text) VALUES (?)", [
        inputText,
      ]);
    } catch (err) {
      if (err instanceof Error && err.code === "SQLITE_CONSTRAINT") {
        console.error(err.message);
      }
    }
  }

  async #list() {
    const memoRows = await getMemoRows(this.db);

    memoRows.forEach((row) => {
      console.log(row.text.split("\n")[0]);
    });
  }

  async #read() {
    const memoRows = await getMemoRows(this.db);
    const answers = await chooseMemo(
      memoRows,
      "memoToRead",
      "list",
      "Choose a memo you want to see:",
    );

    const selectedMemo = answers.memoToRead;
    if (selectedMemo) {
      console.log(`\n${selectedMemo}`);
    }
  }

  async #delete() {
    const memoRows = await getMemoRows(this.db);

    const choices = memoRows.map((row) => ({
      name: row.text.split("\n")[0],
      value: row.id,
    }));

    const answers = await inquirer.prompt([
      {
        name: "memoToDelete",
        type: "list",
        message: "Choose a memo you want to delete:",
        choices,
      },
    ]);

    try {
      await runPromise(this.db, "DELETE FROM memo WHERE id = ?", [
        answers.memoToDelete,
      ]);
      console.log("Memo deleted.");
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
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
    await closeDatabase(this.db);
  }
}

const app = new MemoApp();
app.run();
