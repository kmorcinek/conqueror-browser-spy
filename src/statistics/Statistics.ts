import { Version } from "../Version";
import { OneGameStatistics } from "./OneGameStatistics";

export class Statistics {
  writeResult(statistic: OneGameStatistics) {
    const key = Statistics.getKey();

    let statistics = localStorage.getItem(key) as any;

    if (statistics === null) {
      statistics = [];
    } else {
      statistics = JSON.parse(statistics);
    }

    statistics.push(statistic);

    localStorage.setItem(key, JSON.stringify(statistics));
  }

  static logKey() {
    console.log("key for writing Statistics", this.getKey());
  }

  private static getKey() {
    return "conquerorSpy_statistics_" + Version.versionNumber;
  }
}
