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
