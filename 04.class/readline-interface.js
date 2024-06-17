import readline from "readline";

class ReadlineInterface {
  constructor() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.text = "";
  }

  inputText() {
    return new Promise((resolve) => {
      this.readlineInterface.on("line", (line) => {
        this.text += `${line}\n`;
      });

      this.readlineInterface.on("close", () => {
        if (this.text.endsWith("\n")) {
          this.text = this.text.slice(0, -1);
        }
        resolve(this.text);
      });
    });
  }
}

export default ReadlineInterface;
