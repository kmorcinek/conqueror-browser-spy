import { Province } from "./Province";
import { Culture } from "./Culture";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { Provinces } from "./Provinces";
import { Production } from "./Production";
import { IPrediction } from "./IPrediction";
import { Prediction } from "./Prediction";
import { FarmHistoryChecker } from "./FarmHistoryChecker";
import { FarmPrediction } from "./FarmPrediction";
import { ProvinceHistoryService } from "./ProvinceHistoryService";

export class HistoryChecker {
  private provinceOwnership: IProvinceOwnership;
  private provinceHistoryChecker: ProvinceHistoryChecker;
  private farmHistoryChecker: FarmHistoryChecker;
  private provinceHistoryService: ProvinceHistoryService;

  private alertsToShow: string[] = [];
  private buildingPredictions: Record<string, IPrediction[]> = {};

  constructor(
    provinceOwnership: IProvinceOwnership,
    procinceHistoryChecker: ProvinceHistoryChecker,
    farmHistoryChecker: FarmHistoryChecker,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceHistoryChecker = procinceHistoryChecker;
    this.farmHistoryChecker = farmHistoryChecker;
    for (const provinceName of Provinces.getProvinces()) {
      this.buildingPredictions[provinceName] = [];
    }
    this.provinceHistoryService = provinceHistoryService;
  }

  checkProvinces() {
    const provinces = Provinces.getProvinces();
    for (const provinceName of provinces) {
      if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
        continue;
      }

      const predictions = this.buildingPredictions[provinceName];
      predictions.splice(0, predictions.length);
      const provinceHistory = this.provinceHistoryService.getByName(provinceName);
      const production = this.provinceHistoryChecker.checkHistory(provinceHistory.getHistory());
      if (production !== null) {
        const message = provinceName + " is " + production;
        this.alertsToShow.push(message);
        predictions.push(new Prediction(production));
      } else {
        const nextFarm = this.farmHistoryChecker.whenNextFarm(provinceHistory);
        if (nextFarm !== null) {
          predictions.push(new FarmPrediction(nextFarm));
        }
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
