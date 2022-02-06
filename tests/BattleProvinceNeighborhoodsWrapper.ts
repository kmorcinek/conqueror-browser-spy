import { BattleProvince } from "../src/ai/BattleProvince";

export class BattleProvinceNeighborhoodsWrapper {
  private readonly provinces: Record<string, BattleProvince> = {};

  assign(province: BattleProvince) {
    this.provinces[province.name] = province;
  }

  assignAll(provinces: BattleProvince[]) {
    for (const province of provinces) {
      this.assign(province);
    }
  }

  // Method is declared this way ('... => ...') cause without it
  // "this" does not work inside the method - this.provinces are always undefined
  getByName = (name: string) => {
    return this.provinces[name];
  };
}
