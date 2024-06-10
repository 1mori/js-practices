import inquirer from "inquirer";

import { allPromise, closePromise } from "./db_utils.js";

export async function closeDatabase(db) {
  try {
    await closePromise(db);
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_MISUSE")
      console.error(err.message);
    else throw err;
  }
}

export async function getMemoRows(db) {
  let memoRows;
  try {
    memoRows = await allPromise(db, "SELECT id, text FROM memo");
  } catch (err) {
    if (err instanceof Error && err.code === "SQLITE_ERROR")
      console.error(err.message);
    else throw err;
  }
  return memoRows;
}

export async function chooseMemo(memoRows, name, type, message) {
  const choices = memoRows.map((row) => ({
    name: row.text.split("\n")[0],
    value: row,
  }));

  const answers = await inquirer.prompt([{ name, type, message, choices }]);

  return answers;
}
