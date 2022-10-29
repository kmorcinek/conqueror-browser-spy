import { Color } from "./Color";

export class Card {
  // tslint:disable-next-line: member-ordering
  static parseCard(cardElement: Element): Card {
    let position = (cardElement as any).style.backgroundPosition;
    // '-600% 0%'
    position = position.replace("%", "").replace("-", "");

    const parts = position.split(" ");

    const first = parseInt(parts[0]) / 100;
    const second = parseInt(parts[1]) / 100;

    let color = Color.Other;

    if (second === 0) {
      color = Color.Red;
    }

    return new Card(first + 1, color, cardElement.id);
  }

  readonly rank: number;
  readonly color: Color;
  readonly elementId: string;

  constructor(rank: number, color: Color, elementId: string) {
    if (rank < 1 || rank > 7) {
      throw new Error(`Rank '${rank}' is invalid`);
    }
    this.rank = rank;
    this.color = color;
    this.elementId = elementId;
  }
}
