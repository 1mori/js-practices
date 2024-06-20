import readline from "readline";

class ReadlineInterface {
  constructor() {
    this.readlineInterface = readline.createInterface({
      input: process.stdin,
      output: null
    });

    this.text = "";
    this.sigintReceived = false;

    this.readlineInterface.on("SIGINT", () => {
      this.sigintReceived = true;
      this.readlineInterface.close();
    });
  }

  inputText() {
    return new Promise((resolve, reject) => {
      this.readlineInterface.on("line", (line) => {
        this.text += `${line}\n`;
      });

      this.readlineInterface.on("close", () => {
        if (this.sigintReceived) {
          reject(new Error("SIGINT received"));
        } else {
          if (this.text.endsWith("\n")) {
            this.text = this.text.slice(0, -1);
          }
          resolve(this.text);
        }
      });
    });
  }
}

export default ReadlineInterface;
