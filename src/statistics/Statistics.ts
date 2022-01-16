import { Version } from "../Version";
import { Winner } from "./Winner";

export class Statistics {
  readonly winner: Winner;

  constructor(winner: Winner) {
    this.winner = winner;
  }

  writeResult() {
    const key = this.getKey();

    let statistics = localStorage.getItem(key) as any;

    if (statistics === null) {
      statistics = [];
    } else {
      statistics = JSON.parse(statistics);
    }

    const statistic = this.winner.getStatistic();
    statistics.push(statistic);

    localStorage.setItem(key, JSON.stringify(statistics));
  }

  private getKey() {
    return "conquerorSpy_statistics_" + Version.versionNumber.replace(".", "_");
  }
}
