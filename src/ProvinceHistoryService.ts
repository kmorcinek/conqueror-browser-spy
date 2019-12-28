import { ProvinceHistory } from "./ProvinceHistory";
import { Provinces } from "./Provinces";
import { ProvinceHistoryServiceInterface } from "./ProvinceHistoryServiceInterface";

export class ProvinceHistoryService implements ProvinceHistoryServiceInterface {
  provincesHistory: Record<string, ProvinceHistory> = {};

  constructor() {
    this.reset();
  }

  getByName(provinceName: string): ProvinceHistory {
    return this.provincesHistory[provinceName];
  }

  reset() {
    this.provincesHistory = {};

    const provinces = Provinces.getProvinces();
    for (const provinceName of provinces) {
      this.provincesHistory[provinceName] = new ProvinceHistory();
    }
  }
}
