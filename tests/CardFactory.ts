import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";

export class CardFactory {
  static byRank(rank: number) {
    return new Card(rank, Color.Red, "");
  }
}
