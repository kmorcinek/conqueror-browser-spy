import { Province } from "../Province";
import { ProvinceOwner } from "../ProvinceOwner";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { Production } from "../Production";
import { Fortification } from "../Fortification";

export class BattleProvince {
  readonly province: Province;
  private readonly provinceOwner: ProvinceOwner;
  private readonly neighbors: BattleProvince[] = [];
  private closestOpponent: BattleProvince | undefined;
  private closestOpponentDistance: number = 0;
  private remainingSoldiersInternal: number;

  constructor(province: Province, provinceOwner: ProvinceOwner) {
    if (province == null) {
      throw new Error(`province is null`);
    }
    this.province = province;
    this.provinceOwner = provinceOwner;
    this.remainingSoldiersInternal = province.soldiers;
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

  updateClosestOpponent(province: BattleProvince, distance: number) {
    this.closestOpponent = province;
    this.closestOpponentDistance = distance;
  }

  getClosestOpponentDistance() {
    return this.closestOpponentDistance;
  }

  getNumberOfSoldiersToStayByAttitude(): number {
    switch (this.attitude) {
      case Attitude.Rebellious:
      case Attitude.Restless:
        return Math.ceil(this.farms / 2);
      case Attitude.Content:
        return Math.ceil(this.farms / 4);
      case Attitude.Supportive:
      case Attitude.Devoted:
        return 0;
      default:
        console.error("Missing Attitude");
        throw new Error("Missing Attitude");
    }
  }

  moveOutSoldiers(soldiers: number) {
    this.remainingSoldiersInternal -= soldiers;
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

  get remainingSoldiers(): number {
    return this.remainingSoldiersInternal;
  }

  get fort(): Fortification {
    return this.province.fort;
  }

  get attitude(): Attitude | null {
    return this.province.attitude;
  }
}
