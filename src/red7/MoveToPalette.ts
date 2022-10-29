import { Card } from "./Card";

export class MoveToPallete {
  readonly card: Card;

  constructor(card: Card) {
    this.card = card;
  }
}
