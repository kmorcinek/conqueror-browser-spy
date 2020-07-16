import { Clicker } from "../../Clicker";
import { Production } from "../../Production";
import { Culture } from "../../Culture";
import { GoldService } from "../../GoldService";
import { BattleProvinceNeighborhoods } from "../BattleProvinceNeighborhoods";
import { BattleProvince } from "../BattleProvince";

export class BacklandProductionAi {
  private readonly clicker: Clicker;
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly goldService: GoldService;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    goldService: GoldService
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.goldService = goldService;
  }

  getProductionGoal(province: BattleProvince): Production | null {
    // TODO: seasons not known.

    // enough gold
    

    if (province.culture === Culture.Primitive && province.farms < 5) {
      return Production.Farm;
    }

    if (province.culture === Culture.Primitive && province.farms >= 5) {
      return Production.Culture;
    }

    if (province.culture === Culture.Developed && province.farms < 7) {
      return Production.Farm;
    }

    if (province.hasNeighborOpponent()) {
      return Production.Soldier;
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
      // return BuyProduction.of(Production.Culture);
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
