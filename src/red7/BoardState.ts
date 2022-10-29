import { Card } from "./Card";
import { Color } from "./Color";
import { MoveToPallete } from "./MoveToPalette";
import { OrangeRule } from "./rules/OrangeRule";
import { RedRule } from "./rules/RedRule";
import { Rule } from "./rules/Rule";
import { YellowRule } from "./rules/YellowRule";

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
    // as singleton
    const mapOfRules = new Map<Color, Rule>();
    mapOfRules.set(Color.Red, new RedRule());
    mapOfRules.set(Color.Yellow, new YellowRule());

    if (mapOfRules.get(this.currentRule) === undefined) {
      throw new Error(`Implement more rules`);
    }

    const rule = mapOfRules.get(this.currentRule)!;
    return rule.isMyPalleteBetter(this.myPallete, this.oponentPallete);
  }
}
