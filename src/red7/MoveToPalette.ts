import { Card } from "./Card";

export class MoveToPalette {
  readonly card: Card;

  constructor(card: Card) {
    this.card = card;
  }
}
