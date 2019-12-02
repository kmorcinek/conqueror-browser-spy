import { ProvinceHistory } from "./ProvinceHistory";
import { Provinces } from "./Provinces";

export class ProvinceHistoryService {
  provincesHistory: Record<string, ProvinceHistory> = {};

  getByName(provinceName: string): ProvinceHistory {
    return this.provincesHistory[provinceName];
  }

  reset() {
    this.provincesHistory = {};

    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      this.provincesHistory[provinceName] = new ProvinceHistory();
    }
  }
}
