#!/usr/bin/env node

import minimist from "minimist";

var argv = minimist(process.argv.slice(2));

const today = new Date();
let year = today.getFullYear();
let month = today.getMonth() + 1;

if (argv["y"] !== undefined) {
  year = Number(argv["y"]);
}

if (argv["m"] !== undefined) {
  month = Number(argv["m"]);
}

const first_date = new Date(year, month, 1);
const last_date = new Date(year, month + 1, 0);

console.log("      " + month + "月 " + year);
console.log("日 月 火 水 木 金 土");

const spaces = " ".repeat(3);

for (let i = 0; i < first_date.getDay(); i++) {
  process.stdout.write(spaces);
}

for (
  let current_date = first_date;
  current_date <= last_date;
  current_date.setDate(current_date.getDate() + 1)
) {
  process.stdout.write(
    current_date.getDate().toString().padStart(2, " ") + " ",
  );
  if (current_date.getDay() === 6) {
    console.log();
  }
}
console.log();
