#!/usr/bin/env node

import minimist from "minimist";

const argv = minimist(process.argv.slice(2));

const today = new Date();
const year = argv["y"] !== undefined ? argv["y"] : today.getFullYear();
const month = argv["m"] !== undefined ? argv["m"] - 1 : today.getMonth();

const firstDate = new Date(year, month, 1);
const lastDate = new Date(year, month + 1, 0);

console.log(`      ${month + 1}月 ${year}`);
console.log("日 月 火 水 木 金 土");

for (let i = 0; i < firstDate.getDay(); i++) {
  process.stdout.write(" ".repeat(3));
}

for (
  let currentDate = structuredClone(firstDate);
  currentDate <= lastDate;
  currentDate.setDate(currentDate.getDate() + 1)
) {
  process.stdout.write(currentDate.getDate().toString().padStart(2, " "));
  if (currentDate.getDay() === 6) {
    console.log();
  } else {
    process.stdout.write(" ");
  }
}
console.log();
