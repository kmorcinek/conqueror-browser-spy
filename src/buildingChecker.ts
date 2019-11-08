import { Greeter } from "./globals";
import { ProvinceOwnership } from "./provinceOwnership";

export class BuildingChecker {
  buildingAdvices: string[] = [];

  private provinceOwnership: ProvinceOwnership;

  constructor(provinceOwnership: ProvinceOwnership) {
    this.provinceOwnership = provinceOwnership;
  }

  checkBuildingProvinces() {
    const conqueredProvinces = this.provinceOwnership.getConqueredProvinces();
    for (let i = 0; i < conqueredProvinces.length; i++) {
      const history = Greeter.provincesHistory[conqueredProvinces[i]];

      const last = history[history.length - 1];

      const original = {
        name: last.name,
        farms: this.parsePopulation(last.population).farms,
        resources: this.parsePopulation(last.population).resources,
        culture: last.culture,
        production: last.production,
      };

      const patterns = [
        {
          farms: 4,
          resources: 0,
          production: "farm",
        },
        {
          farms: 5,
          production: "farm",
        },
        {
          farms: 6,
          culture: "dev",
          production: "farm",
        },
        {
          farms: 4,
          culture: "dev",
          production: "culture",
        },
        {
          farms: 5,
          culture: "dev",
          production: "culture",
        },
        {
          farms: 4,
          resources: 2,
          culture: "dev",
          production: "farm",
        },
        {
          farms: 3,
          resources: 2,
          production: "farm",
        },
        {
          farms: 4,
          resources: 2,
          production: "farm",
        },
        {
          farms: 3,
          resources: 2,
          culture: "dev",
          production: "culture",
        },
      ];

      for (let j = 0; j < patterns.length; j++) {
        const pattern = patterns[j];

        pattern.resources = pattern.resources || 0;
        pattern.culture = pattern.culture || "pri";
      }

      for (let j = 0; j < patterns.length; j++) {
        const pattern = patterns[j];

        if (
          original.farms === pattern.farms &&
          original.resources === pattern.resources &&
          original.culture === pattern.culture &&
          original.production === pattern.production
        ) {
          this.buildingAdvices.push(original.name + " should not " + original.production);
        }
      }
    }

    if (this.buildingAdvices.length) {
      const message = this.buildingAdvices.join(", ");
      console.log(message);
      alert(message);
      this.buildingAdvices = [];
    }
  }

  reset() {
    this.buildingAdvices = [];
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
