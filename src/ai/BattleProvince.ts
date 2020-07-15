import { Province } from "../Province";
import { ProvinceOwner } from "../ProvinceOwner";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { Production } from "../Production";

export class BattleProvince {
  readonly province: Province;
  readonly provinceOwner: ProvinceOwner;
  readonly neighbors: BattleProvince[] = [];

  constructor(province: Province, provinceOwner: ProvinceOwner) {
    this.province = province;
    this.provinceOwner = provinceOwner;
  }

  addNeighbor(neighbor: BattleProvince) {
    this.neighbors.push(neighbor);
  }

  getOpponentNeighbors() {
    return this.filterNeighborsByOwner(ProvinceOwner.Opponent);
  }

  hasNeighborOpponent() {
    return this.getOpponentNeighbors().length > 0;
  }

  hasNeighborToConquer() {
    return this.getOpponentNeighbors().length > 0 || this.getNeutralNeighbors().length > 0;
  }

  getNeutralNeighbors() {
    return this.filterNeighborsByOwner(ProvinceOwner.Neutral);
  }

  isMine() {
    return this.provinceOwner === ProvinceOwner.Me;
  }

  isOpponent() {
    return this.provinceOwner === ProvinceOwner.Opponent;
  }

  private filterNeighborsByOwner(provinceOwner: ProvinceOwner) {
    return this.neighbors.filter(neighbor => neighbor.provinceOwner === provinceOwner);
  }

  get name(): string {
    return this.province.name;
  }

  get farms(): number {
    return this.province.farms;
  }

  get resources(): number {
    return this.province.resources;
  }

  get culture(): Culture {
    return this.province.culture;
  }

  get production(): Production | null {
    return this.province.production;
  }

  get soldiers(): number {
    return this.province.soldiers;
  }

  get fort(): string {
    return this.province.fort;
  }

  get attitude(): Attitude | null {
    return this.province.attitude;
  }
}
