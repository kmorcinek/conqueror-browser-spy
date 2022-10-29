import { Card } from "./Card";
import { Color } from "./Color";
import { MoveToPallete } from "./MoveToPalette";
import { RedRule } from "./rules/RedRule";

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

  applyMove(move: MoveToPallete) {
    const myNewPallete = [...this.myPallete];

    return new BoardState(this.currentRule, this.myHand, myNewPallete, this.oponentPallete);
  }

  isMyPalleteBetter() {
    if (this.currentRule === Color.Red) {
      return RedRule.isMyPalleteBetter(this.myPallete, this.oponentPallete);
    }

    throw new Error(`Implement more rules`);
  }
}
