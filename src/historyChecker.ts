import { Greeter } from "./globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { ProcinceHistoryChecker } from "./ProvinceHistoryChecker";
import { ProvinceOwnership } from "./provinceOwnership";
import { Provinces } from "./provinces";

export class HistoryChecker {
  private provinceOwnership: ProvinceOwnership;
  private procinceHistoryChecker: ProcinceHistoryChecker;

  private alertsToShow: string[] = [];

  constructor(
    provinceOwnership: ProvinceOwnership,
    procinceHistoryChecker: ProcinceHistoryChecker
  ) {
    this.provinceOwnership = provinceOwnership;
    this.procinceHistoryChecker = procinceHistoryChecker;
  }

  checkProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
        continue;
      }

      const message = this.procinceHistoryChecker.checkHistory(
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
