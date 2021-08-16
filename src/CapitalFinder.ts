import { IHtmlDocument } from "./IHtmlDocument";
import { Globals } from "./Globals";

// Finds 2 capitals (works only for 2 players), my capital and from opponent
export class CapitalFinder {
  private htmlDocument: IHtmlDocument;

  private myCapital: string | undefined = undefined;
  private opponentCapital: string | undefined = undefined;

  constructor(htmlDocument: IHtmlDocument) {
    this.htmlDocument = htmlDocument;
  }

  setCapitals() {
    if (this.myCapital !== undefined) {
      return;
    }

    this.myCapital = this.findMyCapital();
    console.log(`Capital is ${this.myCapital}`);

    const capitals = this.getCapitals();
    const opponentCapital = this.findOpponentCapital(capitals);
    this.opponentCapital = opponentCapital;
    console.log(`Opponent Capital is ${this.opponentCapital}`);
  }

  unsetCapitals() {
    this.myCapital = undefined;
    this.opponentCapital = undefined;
  }

  private findOpponentCapital(capitals: string[]) {
    if (capitals[0] === this.myCapital) {
      return capitals[1];
    }

    return capitals[0];
  }

  getMyCapital() {
    if (this.myCapital === undefined) {
      throw new Error(`myCapital was not set yet, this method should be called later`);
    }
    return this.myCapital;
  }

  getOpponentCapital(): string {
    if (this.opponentCapital === undefined) {
      throw new Error(`opponentCapital was not set yet, this method should be called later`);
    }
    return this.opponentCapital!;
  }

  getCapitals(): string[] {
    const mapDocument = Globals.getMapDocumentExplicit((this.htmlDocument as unknown) as Document);

    const capitalElements = mapDocument.getElementsByClassName("capital_top");
    const list = [];
    for (const item of capitalElements) {
      list.push(this.parseCapitalName(item.id));
    }

    return list;
  }

  parseCapitalName(text: string): string {
    // "capital_top_b2_0"
    const withUnderscore = text.replace("capital_top_", "");

    const startOfUnderscore = withUnderscore.indexOf("_");

    const result = withUnderscore.substring(0, startOfUnderscore);

    return result;
  }

  private findMyCapital() {
    const spotName = this.htmlDocument.getElementsByClassName("spotName")[0];
    if (spotName.textContent === null) {
      throw new Error(`Text of .spotName cannot be accessed`);
    }
    return this.parseMyCapital(spotName.textContent);
  }

  private parseMyCapital(text: string) {
    // "Lord of a3"
    const startOf = text.indexOf("of");
    return text.substring(startOf + 3);
  }
}
