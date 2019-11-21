import { Greeter } from "./globals";
import { ProvinceOwnership } from "./provinceOwnership";
import { Provinces } from "./provinces";

export class HistoryChecker {
  private provinceOwnership: ProvinceOwnership;

  private alertsToShow: string[] = [];

  constructor(provinceOwnership: ProvinceOwnership) {
    this.provinceOwnership = provinceOwnership;
  }

  checkProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
        continue;
      }

      this.checkHistory(Greeter.provincesHistory[provinceName]);
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

  private checkHistory(history: any) {
    if (history.length === 0) {
      return;
    }

    // population 3 is longer than x (5?) => developing
    // -start from last one
    const last = history[history.length - 1];
    const lastSoldiersCount = last.soldiers;

    if (last.population === "3" && last.culture === "pri") {
      let counter = 0;
      for (let i = history.length - 2; i > -1; i--) {
        const current = history[i];
        if (current.population === "3" && lastSoldiersCount <= current.soldiers) {
          counter++;
        }
      }

      if (counter > 5) {
        this.alertsToShow.push(last.name + " is developing");
      }
    }
  }
}
