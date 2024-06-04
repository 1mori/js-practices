#!/usr/bin/env node

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";

const argv = minimist(process.argv.slice(2));

const rl = readline.createInterface({ input, output });

const db = new sqlite3.Database("./memo.sqlite3");

function runPromise(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this);
      }
    });
  });
}

function allPromise(db, query, params = []) {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

var inputText = "";

rl.on("line", (line) => {
  inputText += line + "\n";
});

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
    console.error("Select error", err);
  }

  db.close();
});
