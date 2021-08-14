import { BattleProvince } from "../src/ai/BattleProvince";

export class NeighbourhoodBuilder {
  static connect(firstProvince: BattleProvince, secondProvince: BattleProvince) {
    firstProvince.addNeighbor(secondProvince);
    secondProvince.addNeighbor(firstProvince);
  }
}
