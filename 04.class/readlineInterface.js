import readline from "readline";

class ReadlineInterface {
  constructor() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
    });

    this.lines = [];
  }

  inputText() {
    return new Promise((resolve, reject) => {
      this.readlineInterface.on("SIGINT", () => {
        this.readlineInterface.close();
        reject(new Error("SIGINT received"));
      });

      this.readlineInterface.on("line", (line) => {
        this.lines.push(line);
      });

      this.readlineInterface.on("close", () => {
        resolve(this.lines.join("\n"));
      });
    });
  }
}

export default ReadlineInterface;
