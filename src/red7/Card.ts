import { Color } from "./Color";

export class Card {
  // tslint:disable-next-line: member-ordering
  static parseCard(cardElement: Element): Card {
    // '-600% 0%'
    let position = (cardElement as any).style.backgroundPosition;

    // (1 Red) is the first card in the big image so it does not have to be
    // moved via backgroundPosition
    if (position === "") {
      return new Card(1, Color.Red, cardElement.id);
    }

    console.log(`Parsing card with position '${position}'`);
    position = position.replace("%", "").replace("-", "");

    const parts = position.split(" ");

    const first = parseInt(parts[0]) / 100;
    const second = parseInt(parts[1]) / 100;

    let color = Color.Other;

    if (second === 0) {
      color = Color.Red;
    }

    if (second === 1) {
      color = Color.Orange;
    }

    return new Card(first + 1, color, cardElement.id);
  }

  readonly rank: number;
  readonly color: Color;
  readonly elementId: string;

  constructor(rank: number, color: Color, elementId: string) {
    if (Number.isNaN(rank)) {
      throw new Error(`Rank is NaN`);
    }
    if (rank < 1 || rank > 7) {
      throw new Error(`Rank '${rank}' is invalid`);
    }
    this.rank = rank;
    this.color = color;
    this.elementId = elementId;
  }

  isGreater(other: Card): boolean {
    if (this.rank === other.rank) {
      return this.color > other.color;
    }

    return this.rank > other.rank;
  }

  compareTo(other: Card): number {
    if (this.rank === other.rank) {
      return this.color - other.color;
    }

    return this.rank - other.rank;
  }

  toString() {
    return `'${this.color}:${this.rank}'`;
  }
}
