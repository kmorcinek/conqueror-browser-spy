import { ProvinceHistory } from "./ProvinceHistory";

// Values from http://kmorcinek.github.io/conqueror-build-time/
export class FarmHistoryChecker {
  timeToBuild: number[][] = [];

  constructor() {
    this.timeToBuild[0] = [3, 4, 4, 5, 6, 7];
    this.timeToBuild[1] = [0, 3, 3, 5, 0, 0];
    this.timeToBuild[2] = [1, 2, 3, 5, 3, 0];
  }

  whenNextFarm(history: ProvinceHistory): number | null {
    if (history.getLength() === 0) {
      return null;
    }

    const currentProvinceState = history.getLast();

    const turnsToBuild = this.timeToBuild[currentProvinceState.resources][
      currentProvinceState.farms - 1
    ];

    // Zero means that there is no value for that combination
    if (turnsToBuild === 0) {
      return null;
    }

    const afterBuilt = history.findHistoryAfterBuildingFinished();
    return afterBuilt.turn + turnsToBuild;
  }
}
