import { Version } from "../Version";
import { OneGameStatistics } from "./OneGameStatistics";

export class Statistics {
  writeResult(statistic: OneGameStatistics) {
    const key = this.getKey();

    const statisticsAsString = localStorage.getItem(key);

    let statistics: OneGameStatistics[];

    if (statisticsAsString === null) {
      statistics = [];
    } else {
      statistics = JSON.parse(statisticsAsString);
    }

    statistics.push(statistic);

    localStorage.setItem(key, JSON.stringify(statistics));
  }

  private getKey() {
    return "conquerorSpy_statistics_" + Version.versionNumber.replace(".", "_");
  }
}
