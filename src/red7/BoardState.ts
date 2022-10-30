import { Card } from "./Card";
import { ChangeRuleMove } from "./ChangeRuleMove";
import { Color } from "./Color";
import { MoveToPallete } from "./MoveToPalette";
import { GreenRule } from "./rules/GreenRule";
import { OrangeRule } from "./rules/OrangeRule";
import { RedRule } from "./rules/RedRule";
import { Rule } from "./rules/Rule";
import { YellowRule } from "./rules/YellowRule";

export class BoardState {
  readonly currentRuleColor: Color;
  readonly myHand: Card[];
  readonly myPallete: Card[];
  readonly oponentPallete: Card[];

  constructor(currentRuleColor: Color, myHand: Card[], myPallete: Card[], oponentPallete: Card[]) {
    this.currentRuleColor = currentRuleColor;
    this.myHand = myHand;
    this.myPallete = myPallete;
    this.oponentPallete = oponentPallete;
  }

  applyMove(move: MoveToPallete) {
    console.log(`Potentially moving card ${move.card.toString()} to palette`);
    const myNewPallete = [...this.myPallete];
    myNewPallete.push(move.card);

    return new BoardState(this.currentRuleColor, this.myHand, myNewPallete, this.oponentPallete);
  }

  // applyRuleChange(move: ChangeRuleMove) {
  //   const myNewPallete = [...this.myPallete];

  //   return new BoardState(this.currentRule, this.myHand, myNewPallete, this.oponentPallete);
  // }

  isMyPalleteBetter() {
    // as singleton
    const mapOfRules = new Map<Color, Rule>();
    mapOfRules.set(Color.Red, new RedRule());
    mapOfRules.set(Color.Orange, new OrangeRule());
    mapOfRules.set(Color.Yellow, new YellowRule());
    mapOfRules.set(Color.Green, new GreenRule());

    const rule = mapOfRules.get(this.currentRuleColor);
    if (rule === undefined) {
      throw new Error(`Implement more rules`);
    }

    return rule.isMyPalleteBetter(this.myPallete, this.oponentPallete);
  }
}
