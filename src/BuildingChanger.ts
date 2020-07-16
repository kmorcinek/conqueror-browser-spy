import { BuildingPattern } from "./BuildingPattern";
import { Clicker } from "./Clicker";

export class BuildingChanger {
  private readonly clicker: Clicker;

  constructor(clicker: Clicker) {
    this.clicker = clicker;
  }

  changeToBetterProduction(provinceName: string, pattern: BuildingPattern) {
    this.clicker.changeProvinceProduction(provinceName, pattern.changeTo);
  }
}
