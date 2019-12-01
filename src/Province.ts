import { Culture } from "./Culture";
import { Production } from "./Production";

export class Province {
  static parsePopulation(population: string) {
    let rest: string = population;
    let resources = 0;

    while (true) {
      // TODO: charCodeAt() should get a length of 'rest'
      const lastChar = rest[rest.length - 1];
      if (lastChar.charCodeAt(0) === 176) {
        rest = rest.substring(0, rest.length - 1);
        resources++;
      } else {
        break;
      }
    }

    return {
      farms: parseInt(rest),
      resources,
    };
  }

  readonly turn: number;
  readonly name: string;
  readonly farms: number;
  readonly resources: number;
  readonly culture: Culture;
  readonly production: Production | null;
  readonly soldiers: number;
  readonly fort: string;

  constructor(
    turn: number,
    name: string,
    farms: number,
    resources: number,
    culture: Culture,
    production: Production | null,
    soldiers: number,
    fort: string
  ) {
    if (turn < 1) {
      throw new Error(`turn '${turn}' cannot be less than 1`);
    }
    this.turn = turn;
    this.name = name;
    this.farms = farms;
    this.resources = resources;
    this.culture = culture;
    this.production = production;
    this.soldiers = soldiers;
    this.fort = fort;
  }

  getPopulation() {
    const resourceDot: string = String.fromCharCode(176);
    let population: string = this.farms.toString();
    if (this.resources === 1) {
      population += resourceDot;
    }
    if (this.resources === 2) {
      population += resourceDot;
      population += resourceDot;
    }
    return population;
  }
}
