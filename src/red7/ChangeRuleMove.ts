import { Card } from "./Card";
import { Color } from "./Color";

export class ChangeRuleMove {
  readonly card: Card;

  constructor(card: Card) {
    this.card = card;
  }

  newRule(): Color {
    return this.card.color;
  }
}
