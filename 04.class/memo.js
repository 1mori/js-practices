#!/usr/bin/env node

import minimist from "minimist";
import inquirer from "inquirer";

import MemoDatabase from "./memo-database.js";
import ReadlineInterface from "./readline-interface.js";

class MemoApp {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.memoDatabase = new MemoDatabase();
  }

  async run() {
    await this.memoDatabase.ensureTableExists();
    if (this.option.l) {
      await this.#list();
    } else if (this.option.r) {
      await this.#read();
    } else if (this.option.d) {
      await this.#delete();
    } else {
      await this.#add();
    }
    await this.memoDatabase.close(this.db);
  }

  async #add() {
    const readlineInterface = new ReadlineInterface();
    try {
      const input = await readlineInterface.inputText();
      await this.memoDatabase.insert(input);
    } catch (err) {
      if (err.message === "SIGINT received") {
        console.log("Input was interrupted by SIGINT.");
      } else {
        throw err;
      }
    }
  }

  async #list() {
    const memos = await this.memoDatabase.all();

    memos.forEach((memo) => {
      console.log(memo.text.split("\n")[0]);
    });
  }

  async #read() {
    const memos = await this.memoDatabase.all();
    if (memos.length === 0) {
      console.log("表示するメモがありません。");
      return;
    }

    const answer = await this.#choose(
      memos,
      "Choose a memo you want to see:",
    );

    const selectedText = answer.memo.text;
    if (selectedText) {
      console.log(`\n${selectedText}`);
    }
  }

  async #delete() {
    const memos = await this.memoDatabase.all();
    if (memos.length === 0) {
      console.log("削除するメモがありません。");
      return;
    }
    const answer = await this.#choose(
      memos,
      "Choose a memo you want to delete:",
    );

    const id = answer.memo.id;
    this.memoDatabase.delete(id);
  }

  async #choose(memos, message) {
    const choices = memos.map((memoRow) => ({
      name: memoRow.text.split("\n")[0],
      value: memoRow,
    }));

    const answer = await inquirer.prompt([
      { name: "memo", type: "list", message, choices },
    ]);

    return answer;
  }
}

new MemoApp().run();
