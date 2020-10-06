import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { BuildingChanger } from "./BuildingChanger";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { StaticProductionChecker } from "./StaticProductionChecker";

export class ProductionChecker {
  buildingAdvices: string[] = [];

  private readonly provinceOwnership: IProvinceOwnership;
  private readonly provinceHistoryService: ProvinceHistoryService;
  private readonly productionWarningsHud: ProductionWarningsHud;
  private readonly staticProductionChecker: StaticProductionChecker;
  private readonly buildingChanger: BuildingChanger;

  constructor(
    provinceOwnership: IProvinceOwnership,
    provinceHistoryService: ProvinceHistoryService,
    productionWarningsHud: ProductionWarningsHud,
    staticProductionChecker: StaticProductionChecker,
    buildingChanger: BuildingChanger
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryService = provinceHistoryService;
    this.productionWarningsHud = productionWarningsHud;
    this.staticProductionChecker = staticProductionChecker;
    this.buildingChanger = buildingChanger;
  }

  // staticProductionChecker() {
  // dynamicProductionChecker() {
  checkBuildingProvinces() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      const original = this.provinceHistoryService.getByName(ownedProvince).getLast();
      const violatedPattern = this.staticProductionChecker.check(original);
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
}
