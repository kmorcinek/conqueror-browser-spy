import { Clicker } from "../Clicker";
import { Production } from "../Production";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { BuyProduction } from "../BuyProduction";
import { GoldService } from "../GoldService";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";

export class ProvinceProductionAi {
  private clicker: Clicker;
  private battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private goldService: GoldService;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    goldService: GoldService
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.goldService = goldService;
  }

  updateAllProvinces() {
    const ownedProvinces = this.battleProvinceNeighborhoods.getOwnedProvinces();
    for (const province of ownedProvinces) {
      this.updateProduction(province);
    }
  }

  updateProduction(province: BattleProvince) {
    const productionGoal = this.getProductionGoal(province);
    if (productionGoal !== null) {
      this.clicker.changeProvinceProduction(province.name, productionGoal);
    }
  }

  private getProductionGoal(province: BattleProvince): Production | BuyProduction | null {
    if (province.province.turn === 1) {
      return BuyProduction.of(Production.Soldier);
    }

    // TODO if is capitol
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

    if (province.soldiers < province.farms) {
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
