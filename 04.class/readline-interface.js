import readline from "readline";

class ReadlineInterface {
  constructor() {
    this.readlineInterface = readline.createInterface({
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
        if (text.endsWith("\n")) {
          text = text.slice(0, -1);
        }
        resolve(text);
      });
    });
  }
}

export default ReadlineInterface;
