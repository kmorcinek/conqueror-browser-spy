import { Culture } from "./Culture";
import { Attitude } from "./Attitude";
import { Production } from "./Production";
import { Fortification } from "./Fortification";

export class Province {
  private static MAX_VALUE = 100;

  // tslint:disable-next-line: member-ordering
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
  readonly fort: Fortification;
  readonly attitude: Attitude | null;

  constructor(
    turn: number,
    name: string,
    farms: number,
    resources: number,
    culture: Culture,
    production: Production | null,
    soldiers: number,
    fort: Fortification,
    attitude: Attitude | null
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
    this.attitude = attitude;
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

  calculateValue() {
    // Provinces that are without soldiers should be first attacked
    if (this.soldiers === 0) {
      return Province.MAX_VALUE;
    }

    const retValue =
      ((this.farms + 2 * this.resources + (this.getCultureMultiplication() - 1)) *
        this.getCultureMultiplication()) /
      this.soldiers;
    // 3k = 3/1 = 3
    // 2k dev = 4 / 2 = 2

    // 3k = 3/1 = 3
    // 2k dev = 6 / 2 = 3
    // TODO: fort as last
    return retValue;
  }

  private getCultureMultiplication() {
    switch (this.culture) {
      case Culture.Primitive:
        return 1;
      case Culture.Developed:
        return 2.5;
      case Culture.Advanded:
        return 4;
    }
  }
}
