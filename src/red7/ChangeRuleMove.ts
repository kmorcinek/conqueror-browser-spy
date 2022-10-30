import { Card } from "./Card";

export class ChangeRuleMove {
  readonly card: Card;

  constructor(card: Card) {
    this.card = card;
  }
}
