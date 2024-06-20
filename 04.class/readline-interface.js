import readline from "readline";

class ReadlineInterface {
  constructor() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: null
    });

    this.lines = [];
    this.sigintReceived = false;
  }

  inputText() {
    return new Promise((resolve, reject) => {
      this.readlineInterface.on("SIGINT", () => {
        this.sigintReceived = true;
        this.readlineInterface.close();
      });

      this.readlineInterface.on("line", (line) => {
        this.lines.push(line);
      });

      this.readlineInterface.on("close", () => {
        if (this.sigintReceived) {
          reject(new Error("SIGINT received"));
        } else {
          resolve(this.lines.join("\n"));
        }
      });
    });
  }
}

export default ReadlineInterface;
