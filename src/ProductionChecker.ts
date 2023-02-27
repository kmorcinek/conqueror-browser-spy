import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { BuildingChanger } from "./BuildingChanger";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { StaticProductionChecker } from "./StaticProductionChecker";
import { Season } from "./Season";
import { Province } from "./Province";
import { BuildingPattern } from "./BuildingPattern";
import { DynamicProductionChecker } from "./DynamicProductionChecker";

export class ProductionChecker {
  buildingAdvices: string[] = [];

  private readonly provinceOwnership: IProvinceOwnership;
  private readonly provinceHistoryService: ProvinceHistoryService;
  private readonly productionWarningsHud: ProductionWarningsHud;
  private readonly staticProductionChecker: StaticProductionChecker;
  private readonly dynamicProductionChecker: DynamicProductionChecker;
  private readonly buildingChanger: BuildingChanger;

  constructor(
    provinceOwnership: IProvinceOwnership,
    provinceHistoryService: ProvinceHistoryService,
    productionWarningsHud: ProductionWarningsHud,
    staticProductionChecker: StaticProductionChecker,
    dynamicProductionChecker: DynamicProductionChecker,
    buildingChanger: BuildingChanger,
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryService = provinceHistoryService;
    this.productionWarningsHud = productionWarningsHud;
    this.staticProductionChecker = staticProductionChecker;
    this.dynamicProductionChecker = dynamicProductionChecker;
    this.buildingChanger = buildingChanger;
  }

  reset() {
    this.buildingAdvices = [];
  }

  checkBuildingProvinces(season: Season) {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      const original = this.provinceHistoryService.getByName(ownedProvince).getLast();
      const violatedPattern = this.staticProductionChecker.check(original);
      if (violatedPattern !== null) {
        this.updateProduction(original, violatedPattern);
      } else {
        const violatedDynamicPattern = this.dynamicProductionChecker.check(original, season);
        if (violatedDynamicPattern !== null) {
          this.updateProduction(original, violatedDynamicPattern);
        }
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

  private updateProduction(original: Province, pattern: BuildingPattern) {
    this.buildingAdvices.push(original.name + " should not " + pattern.production);
    this.buildingChanger.changeToBetterProduction(original.name, pattern);
  }
}
