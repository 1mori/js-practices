#!/usr/bin/env node

import { createInterface } from "readline";

import minimist from "minimist";
import inquirer from "inquirer";

import MemoDatabase from "./memo-database";

class MemoApp {
  constructor() {
    this.option = minimist(process.argv.slice(2));
    this.memoDatabase = new MemoDatabase();
  }

  async #add() {
    const input = await new ReadlineInterface().inputText();
    this.memoDatabase.insert(input);
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
      "memoToRead",
      "list",
      "Choose a memo you want to see:",
    );

    const selectedText = answer.memoToRead.text;
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
      "memoToDelete",
      "list",
      "Choose a memo you want to delete:",
    );

    const id = answer.memoToDelete.id;
    this.memoDatabase.delete(id);
  }

  async #choose(memos, name, type, message) {
    const choices = memos.map((memoRow) => ({
      name: memoRow.text.split("\n")[0],
      value: memoRow,
    }));

    const answer = await inquirer.prompt([{ name, type, message, choices }]);

    return answer;
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
}

class ReadlineInterface {
  constructor() {
    this.readlineInterface = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
  }

  inputText() {
    return new Promise((resolve) => {
      let text = "";
      this.readlineInterface.on("line", (line) => {
        text += `${line}\n`;
      });

      this.readlineInterface.on("close", () => {
        resolve(text);
      });
    });
  }
}

new MemoApp().run();
