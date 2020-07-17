import { Production } from "../../Production";
import { Culture } from "../../Culture";
import { GoldService } from "../../GoldService";
import { BattleProvince } from "../BattleProvince";

export class BacklandProductionAi {
  private readonly goldService: GoldService;

  constructor(
    goldService: GoldService
  ) {
    this.goldService = goldService;
  }

  getProductionGoal(province: BattleProvince): Production | null {
    // TODO: seasons not known.

    // enough gold
    const safeAmount = 50;
    if (this.goldService.getCurrent() - safeAmount < this.goldService.getSupport()) {
      return Production.Gold;
    }

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
