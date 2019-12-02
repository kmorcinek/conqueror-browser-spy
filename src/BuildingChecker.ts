import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceHistoryService } from "./ProvinceHistoryService";

export class BuildingChecker {
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
