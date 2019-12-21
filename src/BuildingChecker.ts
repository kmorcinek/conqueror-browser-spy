import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Province } from "./Province";
import { Production } from "./Production";
import { Culture } from "./Culture";
import { BuildingPattern } from "./BuildingPattern";
import { BuildingChanger } from "./BuildingChanger";

export class BuildingChecker {
  buildingAdvices: string[] = [];

  private provinceOwnership: ProvinceOwnership;
  private provinceHistoryService: ProvinceHistoryService;
  private buildingChanger: BuildingChanger;

  constructor(
    provinceOwnership: ProvinceOwnership,
    provinceHistoryService: ProvinceHistoryService,
    buildingChanger: BuildingChanger
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryService = provinceHistoryService;
    this.buildingChanger = buildingChanger;
  }

  checkBuildingProvinces() {
    const conqueredProvinces = this.provinceOwnership.getConqueredProvinces();
    for (const conqueredProvince of conqueredProvinces) {
      const original = this.provinceHistoryService.getByName(conqueredProvince).getLast();
      const violatedPattern = this.checkBuildingProvince(original);
      if (violatedPattern !== null) {
        this.buildingAdvices.push(original.name + " should not " + violatedPattern.production);
        this.buildingChanger.changeToBetterProduction(original.name, violatedPattern);
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

  checkBuildingProvince(original: Province): BuildingPattern | null {
    const patterns: BuildingPattern[] = [
      {
        farms: 4,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 5,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 6,
        culture: Culture.Developed,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 7,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 4,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 5,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 4,
        resources: 2,
        culture: Culture.Developed,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 3,
        resources: 2,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 4,
        resources: 2,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 3,
        resources: 2,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
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
        return pattern;
      }
    }

    return null;
  }
}
