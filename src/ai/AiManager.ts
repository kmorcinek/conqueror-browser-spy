import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { ProvinceProductionAi } from "./ProvinceProductionAi";
import { ArmyMoverAi } from "./ArmyMoverAi";
import { Clicker } from "../Clicker";

export class AiManager {
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

  run() {
    const runAi: boolean = false;
    if (runAi) {
      this.battleProvinceNeighborhoods.recreateNextTurn();
      this.provinceProductionAi.updateAllProvinces();
      this.armyMoverAi.moveArmies();
      
      const autoEndTurn: boolean = true;
      if (autoEndTurn) {
        window.setTimeout(() => {
          this.clicker.clickEndTurn();
        }, 2000);
      }
    }
  }
}
