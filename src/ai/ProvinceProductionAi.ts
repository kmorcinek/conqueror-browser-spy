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

export class ProvinceProductionAi {
  private readonly clicker: Clicker;
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly backlands: Backlands;
  private readonly backlandProductionAi: BacklandProductionAi;
  private readonly goldService: GoldService;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    backlands: Backlands,
    backlandProductionAi: BacklandProductionAi,
    goldService: GoldService
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.backlands = backlands;
    this.backlandProductionAi = backlandProductionAi;
    this.goldService = goldService;
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
      console.log(`Backland choose to produce ${productionGoal}`);
    } else {
      productionGoal = this.getProductionGoal(province);
    }

    if (productionGoal !== null) {
      if (province.production === productionGoal) {
        console.log(
          `No need to change. ${province.name} is already building ${province.production}`
        );
      } else {
        this.clicker.changeProvinceProduction(province.name, productionGoal);
      }
    }
  }

  private getProductionGoal(province: BattleProvince): Production | BuyProduction | null {
    if (province.province.turn === 1) {
      return BuyProduction.of(Production.Soldier);
    }

    // TODO if is capital
    if (
      province.culture === Culture.Developed &&
      province.farms === 3 &&
      province.hasNeighborToConquer() &&
      province.province.turn < 10
    ) {
      return BuyProduction.of(Production.Soldier);
    }

    if (province.hasNeighborOpponent()) {
      return Production.Soldier;
    }

    if (province.attitude === Attitude.Rebellious || province.attitude === Attitude.Restless) {
      return Production.Diplomat;
    }

    if (province.hasNeighborToConquer() && province.culture !== Culture.Primitive) {
      return Production.Soldier;
    }

    if (province.getClosestOpponentDistance() <= 2 && province.remainingSoldiers < province.farms) {
      return Production.Soldier;
    }

    // TODO: Maybe remove this check as it is done without AI
    if (province.culture === Culture.Advanded) {
      if (
        (province.farms >= 6 && (province.resources === 0 || province.resources === 2)) ||
        province.farms >= 7
      ) {
        return Production.Gold;
      }
    }

    // Buy Culture if you can
    // TODO: more checks here, if the neighbor is opponent or neutral and if opponent has more armies than we
    if (
      province.hasNeighborToConquer() &&
      province.culture === Culture.Primitive &&
      province.farms >= 3 &&
      this.isEnoughGold(Production.Culture)
    ) {
      return BuyProduction.of(Production.Culture);
    }

    if (province.production !== Production.Farm && province.production !== Production.Culture) {
      return Production.Farm;
    }

    return null;
  }

  private isEnoughGold(production: Production) {
    if (production === Production.Culture) {
      // TODO: hardcoded 60
      return this.goldService.getCurrent() - 2 * this.goldService.getSupport() > 60;
    }

    return false;
  }
}
