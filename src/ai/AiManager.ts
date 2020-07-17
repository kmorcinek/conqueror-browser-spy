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

  private runAi: boolean = true;
  private autoEndTurn: boolean = false;

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

  updateRunAi(runAi: boolean) {
    console.log(`Updating runAi to ${runAi}`);
    this.runAi = runAi;
  }

  updateAutoEndTurn(autoEndTurn: boolean) {
    console.log(`Updating autoEndTurn to ${autoEndTurn}`);
    this.autoEndTurn = autoEndTurn;
  }

  run() {
    if (this.runAi) {
      this.battleProvinceNeighborhoods.recreateNextTurn();

      this.backlands.run();
      this.armyMoverAi.moveArmies();
      this.provinceProductionAi.updateAllProvinces();

      if (this.autoEndTurn) {
        window.setTimeout(() => {
          this.clicker.clickEndTurn();
        }, 2000);
      }
    }
  }
}
