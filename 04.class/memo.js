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
    await this.memoDatabase.close();
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
    const memos = await this.memoDatabase.fetchAll();

    memos.forEach((memo) => {
      console.log(memo.text.split("\n")[0]);
    });
  }

  async #read() {
    const memos = await this.memoDatabase.fetchAll();
    if (memos.length === 0) {
      console.log("表示するメモがありません。");
      return;
    }

    const answer = await this.#choose(memos, "Choose a memo you want to see:");

    console.log(answer.memo.text);
  }

  async #delete() {
    const memos = await this.memoDatabase.fetchAll();
    if (memos.length === 0) {
      console.log("削除するメモがありません。");
      return;
    }
    const answer = await this.#choose(
      memos,
      "Choose a memo you want to delete:",
    );

    this.memoDatabase.delete(answer.memo.id);
  }

  async #choose(memos, message) {
    const choices = memos.map((memo) => ({
      name: memo.text.split("\n")[0],
      value: memo,
    }));

    const answer = await inquirer.prompt([
      { name: "memo", type: "list", message, choices },
    ]);

    return answer;
  }
}

new MemoApp().run();
