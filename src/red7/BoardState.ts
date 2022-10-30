import { Card } from "./Card";
import { ChangeRuleMove } from "./ChangeRuleMove";
import { Color } from "./Color";
import { MoveToPalette } from "./MoveToPalette";
import { GreenRule } from "./rules/GreenRule";
import { OrangeRule } from "./rules/OrangeRule";
import { RedRule } from "./rules/RedRule";
import { Rule } from "./rules/Rule";
import { YellowRule } from "./rules/YellowRule";

export class BoardState {
  readonly currentRuleColor: Color;
  readonly myHand: Card[];
  readonly myPalette: Card[];
  readonly oponentPalette: Card[];

  constructor(currentRuleColor: Color, myHand: Card[], myPalette: Card[], oponentPalette: Card[]) {
    this.currentRuleColor = currentRuleColor;
    this.myHand = myHand;
    this.myPalette = myPalette;
    this.oponentPalette = oponentPalette;
  }

  applyMove(move: MoveToPalette) {
    console.log(`Potentially moving card ${move.card.toString()} to palette`);
    const myNewPalette = [...this.myPalette];
    myNewPalette.push(move.card);

    return new BoardState(this.currentRuleColor, this.myHand, myNewPalette, this.oponentPalette);
  }

  // applyRuleChange(move: ChangeRuleMove) {
  //   const myNewPalette = [...this.myPalette];

  //   return new BoardState(this.currentRule, this.myHand, myNewPalette, this.oponentPalette);
  // }

  isMyPaletteBetter() {
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

    return rule.isMyPaletteBetter(this.myPalette, this.oponentPalette);
  }
}
