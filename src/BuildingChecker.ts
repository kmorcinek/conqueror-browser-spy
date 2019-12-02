import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Province } from "./Province";
import { Production } from "./Production";
import { Culture } from "./Culture";
import { BuildingPattern } from "./BuildingPattern";

export class BuildingChecker {
  static checkBuildingProvince(original: Province): Production | null {
    const patterns: BuildingPattern[] = [
      {
        farms: 4,
        production: Production.Farm,
      },
      {
        farms: 5,
        production: Production.Farm,
      },
      {
        farms: 6,
        culture: Culture.Developed,
        production: Production.Farm,
      },
      {
        farms: 4,
        culture: Culture.Developed,
        production: Production.Culture,
      },
      {
        farms: 5,
        culture: Culture.Developed,
        production: Production.Culture,
      },
      {
        farms: 4,
        resources: 2,
        culture: Culture.Developed,
        production: Production.Farm,
      },
      {
        farms: 3,
        resources: 2,
        production: Production.Farm,
      },
      {
        farms: 4,
        resources: 2,
        production: Production.Farm,
      },
      {
        farms: 3,
        resources: 2,
        culture: Culture.Developed,
        production: Production.Culture,
      },
    ];

    for (const pattern of patterns) {
      pattern.resources = pattern.resources || 0;
      pattern.culture = pattern.culture || Culture.Primitive;
    }

    for (const pattern of patterns) {
      if (
        original.farms === pattern.farms &&
        original.resources === pattern.resources &&
        original.culture === pattern.culture &&
        original.production === pattern.production
      ) {
        return original.production;
      }
    }

    return null;
  }

  buildingAdvices: string[] = [];

  private provinceOwnership: ProvinceOwnership;
  private provinceHistoryService: ProvinceHistoryService;

  constructor(
    provinceOwnership: ProvinceOwnership,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryService = provinceHistoryService;
  }

  checkBuildingProvinces() {
    const conqueredProvinces = this.provinceOwnership.getConqueredProvinces();
    for (const conqueredProvince of conqueredProvinces) {
      const original = this.provinceHistoryService.getByName(conqueredProvince).getLast();
      const unwantedProduction = BuildingChecker.checkBuildingProvince(original);
      if (unwantedProduction !== null) {
        this.buildingAdvices.push(original.name + " should not " + unwantedProduction);
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
