import { ColorPicker } from "./ColorPicker";

export class Settings {
  private myColor: string | undefined = undefined;

  setMyCapital() {
    if (this.myColor === undefined) {
      const capitalName = this.getCapital();

      console.warn(`Capital is ${capitalName}`);
      this.myColor = ColorPicker.getColor(capitalName);
      console.log(`Capital color is ${this.myColor}`);
    }
  }

  getMyColor() {
    if (this.myColor === undefined) {
      throw new Error(`myColor was not set yet, this method should be called later`);
    }
    return this.myColor;
  }

  private getCapital() {
    const spotName = document.getElementsByClassName("spotName")[0];
    if (spotName.textContent === null) {
      throw new Error(`text of .spotName cannot be accessed`);
    }
    return this.parseCapital(spotName.textContent);
  }

  private parseCapital(text: string) {
    // "Lord of a3"
    const startOf = text.indexOf("of");
    return text.substring(startOf + 3);
  }
}
