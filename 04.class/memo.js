#!/usr/bin/env node

import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";

const argv = minimist(process.argv.slice(2));

const rl = readline.createInterface({ input, output });

const db = new sqlite3.Database("./memo.sqlite3");

var inputLines = [];

rl.on("line", (line) => {
  inputLines.push(line);
});

rl.on("close", () => {
  console.log(inputLines);
});
