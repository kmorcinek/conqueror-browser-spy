import { IBattleProvinceNeighborhoods } from "../IBattleProvinceNeighborhoods";
import { BattleProvince } from "../BattleProvince";

export class Backlands {
  private readonly battleProvinceNeighborhoods: IBattleProvinceNeighborhoods;

  private chosen: string | undefined;

  constructor(battleProvinceNeighborhoods: IBattleProvinceNeighborhoods) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
  }

  isBackland(provinceName: string): boolean {
    return provinceName === this.chosen;
  }

  chooseBacklands() {
    this.chosen = undefined;
    // choose one as backland based on distance from opponent.
    // choose by provinceName.
    // all neighbors are mine.
    const sortedByOpponentDistance: BattleProvince[] = this.battleProvinceNeighborhoods
      .getOwnedProvinces()
      .filter(bp => !bp.hasNeighborToConquer())
      .sort(
        (first, second) => first.getClosestOpponentDistance() - second.getClosestOpponentDistance(),
      )
      .reverse();

    if (sortedByOpponentDistance.length) {
      const farthestFromOpponent = sortedByOpponentDistance[0];
      this.chosen = farthestFromOpponent.name;
      console.log(`Choose ${this.chosen} as backland`);
    }
  }
}
