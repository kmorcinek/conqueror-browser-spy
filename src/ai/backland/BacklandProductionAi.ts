import { Production } from "../../Production";
import { Culture } from "../../Culture";
import { GoldService } from "../../GoldService";
import { BattleProvince } from "../BattleProvince";
import { Settings } from "../../Settings";
import { Season } from "../../Season";

export class BacklandProductionAi {
  private readonly goldService: GoldService;
  private readonly settings: Settings;

  constructor(goldService: GoldService, settings: Settings) {
    this.goldService = goldService;
    this.settings = settings;
  }

  getProductionGoal(province: BattleProvince): Production | null {
    // start from some turn (5) after first winter is passed
    if (this.missingGoldInWinter() && this.settings.getTurn() > 5) {
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
    if (province.culture === Culture.Advanced) {
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

  private missingGoldInWinter() {
    const safeAmount = 20 + (this.settings.getTurn() - 20);
    return (
      this.settings.getSeason() === Season.Winter &&
      this.goldService.getCurrentGold() - safeAmount <
        this.goldService.getGoldRequiredForWinterSupport()
    );
  }
}
