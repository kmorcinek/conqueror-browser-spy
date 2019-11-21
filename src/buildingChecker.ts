import { Greeter } from "./globals";
import { Province } from "./Province";
import { ProvinceOwnership } from "./provinceOwnership";

export class BuildingChecker {
  buildingAdvices: string[] = [];

  private provinceOwnership: ProvinceOwnership;

  constructor(provinceOwnership: ProvinceOwnership) {
    this.provinceOwnership = provinceOwnership;
  }

  checkBuildingProvinces() {
    const conqueredProvinces = this.provinceOwnership.getConqueredProvinces();
    for (const conqueredProvince of conqueredProvinces) {
      const history: Province[] = Greeter.provincesHistory[conqueredProvince];

      const original = history[history.length - 1];

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

      for (const pattern of patterns) {
        pattern.resources = pattern.resources || 0;
        pattern.culture = pattern.culture || "pri";
      }

      for (const pattern of patterns) {
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
}
