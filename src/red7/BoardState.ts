import { Card } from "./Card";
import { Color } from "./Color";

export class BoardState {
  readonly currentRule: Color;
  readonly myHand: Card[];
  readonly myPallete: Card[];
  readonly oponentPallete: Card[];

  constructor(currentRule: Color, myHand: Card[], myPallete: Card[], oponentPallete: Card[]) {
    this.currentRule = currentRule;
    this.myHand = myHand;
    this.myPallete = myPallete;
    this.oponentPallete = oponentPallete;
  }
}
