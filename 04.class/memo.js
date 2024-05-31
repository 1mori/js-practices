import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

import minimist from "minimist";
import sqlite3 from "sqlite3";

const argv = minimist(process.argv.slice(2));

const rl = readline.createInterface({ input, output });

async function main() {
  try {
    const answer = await rl.question("");
    // SQLの挿入処理を書く
  } catch (err) {
    console.error("Error reading input:", err);
  } finally {
    rl.close();
  }
}

main();
