import { BattleProvinceNeighborhoods } from "../BattleProvinceNeighborhoods";
import { BattleProvince } from "../BattleProvince";
import { Season } from "../../Season";
import { GoldService } from "../../GoldService";
import { Settings } from "../../Settings";

export class Backlands {
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly goldService: GoldService;
  private readonly settings: Settings;

  private chosen: string | undefined;

  constructor(
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    goldService: GoldService,
    settings: Settings
  ) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.goldService = goldService;
    this.settings = settings;
  }

  isBackland(provinceName: string): boolean {
    return provinceName === this.chosen;
  }

  chooseBacklands() {
    // choose one as backland based on distance from opponent.
    // choose by provinceName.
    // all neighbors are mine.
    // start from some turn
    const turn = this.battleProvinceNeighborhoods.getOwnedProvinces()[0].province.turn;

    if (turn > 5) {
      if (this.missingGoldInWinter()) {
        const farthestFromOpponent: BattleProvince = this.battleProvinceNeighborhoods
          .getOwnedProvinces()
          .filter(bp => !bp.hasNeighborToConquer())
          .sort(
            (first, second) =>
              first.getClosestOpponentDistance() - second.getClosestOpponentDistance()
          )
          .reverse()[0];

        this.chosen = farthestFromOpponent.name;
        console.log(`Choose ${this.chosen} as backland`);
      } else {
        this.chosen = undefined;
      }
    }
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
