import { Province } from "./Province";
import { Production } from "./Production";
import { Culture } from "./Culture";
import { BuildingPattern } from "./BuildingPattern";
import { DynamicBuildingPattern } from "./DynamicBuildingPattern";
import { Season } from "./Season";

export class DynamicProductionChecker {
  check(original: Province, season: Season): BuildingPattern | null {
    const patterns: DynamicBuildingPattern[] = [
      {
        season: Season.Autumn,
        farms: 10,
        resources: 0,
        production: Production.Soldier,
        changeTo: Production.Farm,
      },
      {
        season: Season.Autumn,
        farms: 11,
        resources: 1,
        production: Production.Soldier,
        changeTo: Production.Farm,
      },
      {
        season: Season.Autumn,
        farms: 12,
        resources: 2,
        production: Production.Soldier,
        changeTo: Production.Farm,
      },
      {
        season: Season.Spring,
        farms: 10,
        resources: 0,
        production: Production.Farm,
        changeTo: Production.Soldier,
      },
      {
        season: Season.Spring,
        farms: 11,
        resources: 1,
        production: Production.Farm,
        changeTo: Production.Soldier,
      },
      {
        season: Season.Spring,
        farms: 12,
        resources: 2,
        production: Production.Farm,
        changeTo: Production.Soldier,
      },
    ];

    for (const pattern of patterns) {
      pattern.culture = Culture.Advanced;
    }

    for (const pattern of patterns) {
      if (
        original.farms === pattern.farms &&
        original.resources === pattern.resources &&
        original.culture === pattern.culture &&
        original.production === pattern.production &&
        season === pattern.season
      ) {
        return pattern;
      }
    }

    return null;
  }
}
