import { BuildingPattern } from "./BuildingPattern";
import { Clicker } from "./Clicker";
import { Production } from "./Production";

export class BuildingChanger {
  private clicker: Clicker;

  constructor(clicker: Clicker) {
    this.clicker = clicker;
  }

  changeToBetterProduction(provinceName: string, pattern: BuildingPattern) {
    this.clicker.changeProvinceProduction(provinceName, pattern.changeTo);
  }
}
