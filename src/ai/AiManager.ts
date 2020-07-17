import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { ProvinceProductionAi } from "./ProvinceProductionAi";
import { ArmyMoverAi } from "./ArmyMoverAi";
import { Clicker } from "../Clicker";
import { Backlands } from "./backland/Backlands";

export class AiManager {
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly backlands: Backlands;
  private readonly armyMoverAi: ArmyMoverAi;
  private readonly provinceProductionAi: ProvinceProductionAi;
  private readonly clicker = new Clicker();

  constructor(
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    backlands: Backlands,
    armyMoverAi: ArmyMoverAi,
    provinceProductionAi: ProvinceProductionAi
  ) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.backlands = backlands;
    this.armyMoverAi = armyMoverAi;
    this.provinceProductionAi = provinceProductionAi;
  }

  run() {
    const runAi: boolean = true;
    if (runAi) {
      this.battleProvinceNeighborhoods.recreateNextTurn();

      this.backlands.run();
      this.provinceProductionAi.updateAllProvinces();
      this.armyMoverAi.moveArmies();

      const autoEndTurn: boolean = false;
      if (autoEndTurn) {
        window.setTimeout(() => {
          this.clicker.clickEndTurn();
        }, 2000);
      }
    }
  }
}
