import { Greeter } from "./Globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { Provinces } from "./Provinces";

export class HistoryChecker {
  private provinceOwnership: ProvinceOwnership;
  private provinceHistoryChecker: ProvinceHistoryChecker;

  private alertsToShow: string[] = [];

  constructor(
    provinceOwnership: ProvinceOwnership,
    procinceHistoryChecker: ProvinceHistoryChecker
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryChecker = procinceHistoryChecker;
  }

  checkProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
        continue;
      }

      const message = this.provinceHistoryChecker.checkHistory(
        Greeter.provincesHistory[provinceName]
      );
      if (message !== null) {
        this.alertsToShow.push(message);
      }
    }

    // TODO: refactor alertsToShow
    if (this.alertsToShow.length) {
      const message = this.alertsToShow.join(", ");
      console.log(message);
      alert(message);
      this.alertsToShow = [];
    }
  }

  reset() {
    this.alertsToShow = [];
  }
}
