import { ColorPicker } from "./ColorPicker";

export class Settings {
  private myColor: string | undefined = undefined;

  setMyCapital() {
    if (this.myColor === undefined) {
      const capitalName = this.getCapitol();

      console.warn(`Capitol is ${capitalName}`);
      this.myColor = ColorPicker.getColor(capitalName);
    }
  }

  getMyColor() {
    if (this.myColor === undefined) {
      throw new Error(`myColor was not set yet, this method should be called later`);
    }
    return this.myColor;
  }

  private getCapitol() {
    const spotName = document.getElementsByClassName("spotName")[0];
    if (spotName.textContent === null) {
      throw new Error(`text of .spotName cannot be accessed`);
    }
    return this.parseCapitol(spotName.textContent);
  }

  private parseCapitol(text: string) {
    // "Lord of a3"
    const startOf = text.indexOf("of");
    return text.substring(startOf + 3);
  }
}
