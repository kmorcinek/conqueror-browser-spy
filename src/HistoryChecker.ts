import { Greeter } from "./Globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { Provinces } from "./Provinces";
import { Production } from "./Production";
import { IPrediction } from "./IPrediction";
import { Prediction } from "./Prediction";

export class HistoryChecker {
  private provinceOwnership: ProvinceOwnership;
  private provinceHistoryChecker: ProvinceHistoryChecker;

  private alertsToShow: string[] = [];
  private buildingPredictions: Record<string, IPrediction[]> = {};

  constructor(
    provinceOwnership: ProvinceOwnership,
    procinceHistoryChecker: ProvinceHistoryChecker
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryChecker = procinceHistoryChecker;
    for (const provinceName of Provinces.GetProvinces()) {
      this.buildingPredictions[provinceName] = [];
    }
  }

  checkProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
        continue;
      }

      const predictions = this.buildingPredictions[provinceName];
      predictions.splice(0, predictions.length);
      const production = this.provinceHistoryChecker.checkHistory(
        Greeter.provincesHistory[provinceName].getHistory()
      );
      if (production !== null) {
        const message = provinceName + " is " + production;
        this.alertsToShow.push(message);
        predictions.push(new Prediction(production));
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

  getPrediction(provinceName: string): IPrediction[] {
    return this.buildingPredictions[provinceName];
  }
}
