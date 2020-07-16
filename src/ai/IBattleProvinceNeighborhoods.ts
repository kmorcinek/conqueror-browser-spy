import { BattleProvince } from "./BattleProvince";

export interface IBattleProvinceNeighborhoods {
  recreateNextTurn(): void;
  getOwnedProvinces(): BattleProvince[];
  getByName(name: string): BattleProvince;
  getClosestNotConqueredNeighbors(battleProvince: BattleProvince): BattleProvince[];
  getDistance(source: BattleProvince, target: BattleProvince): number;
  getPath(source: BattleProvince, target: BattleProvince): string[];
  getManyPathWithDistance2(source: BattleProvince, target: BattleProvince): BattleProvince[][];
}
