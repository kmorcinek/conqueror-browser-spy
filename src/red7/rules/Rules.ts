import { Card } from "../Card";

export class Rules {
  static getBest(cards: Card[]): Card {
    cards.sort((a, b) => a.compareTo(b));

    return cards[cards.length - 1];
  }
}
