import { Production } from "../Production";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { BuyProduction } from "../BuyProduction";
import { GoldService } from "../GoldService";
import { BattleProvince } from "./BattleProvince";

export class RegularProvinceProductionGoal {
  private readonly goldService: GoldService;

  constructor(goldService: GoldService) {
    this.goldService = goldService;
  }

  getProductionGoal(province: BattleProvince): Production | BuyProduction | null {
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
    if (province.culture === Culture.Advanced) {
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
      return (
        this.goldService.getCurrentGold() - 2 * this.goldService.getGoldRequiredForWinterSupport() >
        60
      );
    }

    return false;
  }
}
