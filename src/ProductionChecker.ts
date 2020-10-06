import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Province } from "./Province";
import { Production } from "./Production";
import { Culture } from "./Culture";
import { BuildingPattern } from "./BuildingPattern";
import { BuildingChanger } from "./BuildingChanger";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { IProvinceOwnership } from "./IProvinceOwnership";

export class ProductionChecker {
  buildingAdvices: string[] = [];

  private readonly provinceOwnership: IProvinceOwnership;
  private readonly provinceHistoryService: ProvinceHistoryService;
  private readonly productionWarningsHud: ProductionWarningsHud;
  private readonly buildingChanger: BuildingChanger;

  constructor(
    provinceOwnership: IProvinceOwnership,
    provinceHistoryService: ProvinceHistoryService,
    productionWarningsHud: ProductionWarningsHud,
    buildingChanger: BuildingChanger
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryService = provinceHistoryService;
    this.productionWarningsHud = productionWarningsHud;
    this.buildingChanger = buildingChanger;
  }

  checkBuildingProvinces() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      const original = this.provinceHistoryService.getByName(ownedProvince).getLast();
      const violatedPattern = this.checkBuildingProvince(original);
      if (violatedPattern !== null) {
        this.buildingAdvices.push(original.name + " should not " + violatedPattern.production);
        this.buildingChanger.changeToBetterProduction(original.name, violatedPattern);
      }
    }

    let message = "";
    if (this.buildingAdvices.length) {
      message = this.buildingAdvices.join(", ");
      console.log(message);
      this.buildingAdvices = [];
    }
    this.productionWarningsHud.update(message);
  }

  reset() {
    this.buildingAdvices = [];
  }

  checkBuildingProvince(original: Province): BuildingPattern | null {
    const patterns: BuildingPattern[] = [
      {
        farms: 1,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 2,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 3,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
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
        farms: 1,
        resources: 1,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 2,
        resources: 1,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      // Do not force, it some situations it's better to first develop
      // {
      //   farms: 3,
      //   resources: 1,
      //   production: Production.Culture,
      //   changeTo: Production.Farm,
      // },

      // Depending if it takes 2 or 3 turns to build a farm
      // {
      //   farms: 4,
      //   resources: 1,
      //   production: Production.Culture,
      //   changeTo: Production.Farm,
      // },
      {
        farms: 5,
        resources: 1,
        production: Production.Farm,
        changeTo: Production.Culture,
      },
      {
        farms: 1,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 2,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 3,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 4,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 5,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
      },
      {
        farms: 6,
        resources: 1,
        culture: Culture.Developed,
        production: Production.Culture,
        changeTo: Production.Farm,
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
