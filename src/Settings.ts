import { ColorPicker } from "./ColorPicker";
import { Season } from "./Season";
import { Seasons } from "./Seasons";
import { CapitalFinder } from "./CapitalFinder";

export class Settings {
  private capitals: CapitalFinder;
  private isSet: boolean = false;
  private myColor: string | undefined = undefined;
  private season: Season | undefined = undefined;
  private turn: number | undefined = undefined;

  constructor(capitalFinder: CapitalFinder) {
    this.capitals = capitalFinder;
  }

  setEverything() {
    if (this.isSet) {
      return;
    }

    this.capitals.setCapitals();
    this.myColor = ColorPicker.getColor(this.capitals.getMyCapital());
    console.log(`Capital color is ${this.myColor}`);
    this.isSet = true;
  }

  unsetEverything() {
    this.isSet = false;
    this.myColor === undefined;
    this.capitals.unsetCapitals();
    this.unsetTurn();
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

  private unsetTurn() {
    this.turn = undefined;
    this.season = undefined;
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

  getMyCapital(): string {
    return this.capitals.getMyCapital();
  }

  getOpponentCapital(): string {
    return this.capitals.getOpponentCapital();
  }
}
