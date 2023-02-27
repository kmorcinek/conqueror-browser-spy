import { Clicker } from "../Clicker";
import { Production } from "../Production";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { BuyProduction } from "../BuyProduction";
import { GoldService } from "../GoldService";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";
import { Backlands } from "./backland/Backlands";
import { BacklandProductionAi } from "./backland/BacklandProductionAi";
import { RegularProvinceProductionGoal } from "./RegularProvinceProductionGoal";

export class ProvinceProductionAi {
  private readonly clicker: Clicker;
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly backlands: Backlands;
  private readonly backlandProductionAi: BacklandProductionAi;
  private readonly goldService: GoldService;
  private readonly regularProvinceProductionGoal: RegularProvinceProductionGoal;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    backlands: Backlands,
    backlandProductionAi: BacklandProductionAi,
    goldService: GoldService,
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.backlands = backlands;
    this.backlandProductionAi = backlandProductionAi;
    this.goldService = goldService;
    this.regularProvinceProductionGoal = new RegularProvinceProductionGoal(goldService);
  }

  updateAllProvinces() {
    const ownedProvinces = this.battleProvinceNeighborhoods.getOwnedProvinces();
    for (const province of ownedProvinces) {
      this.updateProduction(province);
    }
  }

  updateProduction(province: BattleProvince) {
    let productionGoal: Production | BuyProduction | null;
    if (this.backlands.isBackland(province.name)) {
      productionGoal = this.backlandProductionAi.getProductionGoal(province);
      if (productionGoal === null) {
        productionGoal = this.regularProvinceProductionGoal.getProductionGoal(province);
      }
    } else {
      productionGoal = this.regularProvinceProductionGoal.getProductionGoal(province);
    }

    if (productionGoal !== null) {
      if (province.production === productionGoal) {
        console.log(
          `No need to change. ${province.name} is already building ${province.production}`,
        );
      } else {
        this.clicker.changeProvinceProduction(province.name, productionGoal);
      }
    }
  }
}
