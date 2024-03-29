import { Production } from "../../Production";
import { GoldService } from "../../GoldService";
import { Settings } from "../../Settings";
import { Season } from "../../Season";

export class BacklandProductionAi {
  private readonly goldService: GoldService;
  private readonly settings: Settings;

  constructor(goldService: GoldService, settings: Settings) {
    this.goldService = goldService;
    this.settings = settings;
  }

  getProductionGoal(): Production | null {
    const productionGoal = this.calculateProductionGoal();
    if (productionGoal === null) {
      console.log(`Backland choose not to produce anything particular`);
    } else {
      console.log(`Backland choose to produce ${productionGoal}`);
    }

    return productionGoal;
  }

  private calculateProductionGoal(): Production | null {
    // start from some turn (5) after first winter is passed
    if (this.missingGoldInWinter() && this.settings.getTurn() > 5) {
      return Production.Gold;
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
