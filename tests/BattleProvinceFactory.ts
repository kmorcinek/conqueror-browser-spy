import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceFactory } from "./ProvinceFactory";
import { ProvinceOwner } from "../src/ProvinceOwner";

export class BattleProvinceFactory {
  provinceFactory: ProvinceFactory = new ProvinceFactory();
  provinceOwner: ProvinceOwner = ProvinceOwner.Me;
  closestOpponents: BattleProvince[] = [];
  closestOpponentDistance: number = 2;
  opponentCapitalDistance: number = 1;
  ownCapitalDistance: number = 2;

  build() {
    const battleProvince = new BattleProvince(this.provinceFactory.build(), this.provinceOwner);
    battleProvince.updateOwnCapitalDistance(this.ownCapitalDistance);
    battleProvince.updateOpponentCapitalDistance(this.opponentCapitalDistance);
    battleProvince.updateClosestOpponents(this.closestOpponents, this.closestOpponentDistance);
    return battleProvince;
  }
}
