import { Color } from "./Color";

export class Card {
  // tslint:disable-next-line: member-ordering
  // static parseCard(cardElementId: string): Card {
  //   // cardElementId: my_cards_item_16
  //   let rest: string = population;
  //   let resources = 0;

  //   while (true) {
  //     // TODO: charCodeAt() should get a length of 'rest'
  //     const lastChar = rest[rest.length - 1];
  //     if (lastChar.charCodeAt(0) === 176) {
  //       rest = rest.substring(0, rest.length - 1);
  //       resources++;
  //     } else {
  //       break;
  //     }
  //   }

  //   return {
  //     farms: parseInt(rest),
  //     resources,
  //   };
  // }

  readonly rank: number;
  readonly color: Color;

  constructor(rank: number, color: Color) {
    // if (turn < 1) {
    // throw new Error(`Turn '${turn}' cannot be less than 1`);
    // }
    this.rank = rank;
    this.color = color;
  }

  // getPopulation() {
  //   const resourceDot: string = String.fromCharCode(176);
  //   let population: string = this.farms.toString();
  //   if (this.resources === 1) {
  //     population += resourceDot;
  //   }
  //   if (this.resources === 2) {
  //     population += resourceDot;
  //     population += resourceDot;
  //   }
  //   return population;
  // }
}
