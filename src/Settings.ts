import { ColorPicker } from "./ColorPicker";
import { Season } from "./Season";
import { Seasons } from "./Seasons";

export class Settings {
  private myCapital: string | undefined = undefined;
  private myColor: string | undefined = undefined;
  private season: Season | undefined = undefined;
  private turn: number | undefined = undefined;

  setMyCapital() {
    if (this.myColor === undefined) {
      this.myCapital = this.getCapital();

      console.log(`Capital is ${this.myCapital}`);
      this.myColor = ColorPicker.getColor(this.myCapital);
      console.log(`Capital color is ${this.myColor}`);
    }
  }

  getMyCapital() {
    if (this.myCapital === undefined) {
      throw new Error(`myCapital was not set yet, this method should be called later`);
    }
    return this.myCapital;
  }

  getOpponentCapital(): string {
    switch (this.getMyCapital()) {
      case "a3":
        return "e1";
      case "e1":
        return "a3";
      default:
        throw new Error(`Cannot find opponent capital based on my capital`);
    }
  }

  getMyColor() {
    if (this.myColor === undefined) {
      throw new Error(`myColor was not set yet, this method should be called later`);
    }
    return this.myColor;
  }

  setTurn(turn: number) {
    this.turn = turn;
    this.season = Seasons.parseSeason(turn);
  }

  getSeason(): Season {
    if (this.season === undefined) {
      throw new Error(`season was not set yet, this method should be called later`);
    }
    return this.season;
  }

  getTurn(): number {
    if (this.turn === undefined) {
      throw new Error(`turn was not set yet, this method should be called later`);
    }
    return this.turn;
  }

  private getCapital() {
    const spotName = document.getElementsByClassName("spotName")[0];
    if (spotName.textContent === null) {
      throw new Error(`Text of .spotName cannot be accessed`);
    }
    return this.parseCapital(spotName.textContent);
  }

  private parseCapital(text: string) {
    // "Lord of a3"
    const startOf = text.indexOf("of");
    return text.substring(startOf + 3);
  }
}
