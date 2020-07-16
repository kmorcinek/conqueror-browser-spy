import { BattleProvinceNeighborhoods } from "../BattleProvinceNeighborhoods";
import { ProvinceProductionAi } from "../ProvinceProductionAi";
import { ArmyMoverAi } from "../ArmyMoverAi";
import { Clicker } from "../../Clicker";

export class Backlands {
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly armyMoverAi: ArmyMoverAi;
  private readonly provinceProductionAi: ProvinceProductionAi;
  private readonly clicker = new Clicker();

  constructor(
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    armyMoverAi: ArmyMoverAi,
    provinceProductionAi: ProvinceProductionAi
  ) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMoverAi = armyMoverAi;
    this.provinceProductionAi = provinceProductionAi;
  }

  isBackland(provinceName: string): boolean {
    return false;
  }

  run() {
    // choose one as backland based on distance from opponent.
    // choose by provinceName.
    // all neighbors are mine.
    const runAi: boolean = false;
    if (runAi) {
      this.battleProvinceNeighborhoods.recreateNextTurn();
      this.provinceProductionAi.updateAllProvinces();
      this.armyMoverAi.moveArmies();
      window.setTimeout(() => {
        this.clicker.clickEndTurn();
      }, 2000);
    }
  }
}
