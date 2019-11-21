import { Culture } from "./Culture";

export class Province {
  readonly turn: number;
  readonly name: string;
  readonly farms: number;
  readonly resources: number;
  readonly culture: Culture;
  readonly production: string;
  readonly soldiers: number;
  readonly fort: string;
  private readonly population: string;

  constructor(
    turn: number,
    name: string,
    population: string,
    culture: Culture,
    production: string,
    soldiers: number,
    fort: string
  ) {
    this.turn = turn;
    this.name = name;
    this.population = population;
    const farmsWithResources = this.parsePopulation(population);
    this.farms = farmsWithResources.farms;
    this.resources = farmsWithResources.resources;
    this.culture = culture;
    this.production = production;
    this.soldiers = soldiers;
    this.fort = fort;
  }

  getPopulation() {
    return this.population;
  }

  private parsePopulation(population: string) {
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
}
