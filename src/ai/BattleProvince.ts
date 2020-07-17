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
  private closestOpponents: BattleProvince[] = [];
  private closestOpponentDistance: number = 0;
  private opponentCapitalDistance: number | undefined;
  private ownCapitalDistance: number | undefined;
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

  updateClosestOpponents(provinces: BattleProvince[], distance: number) {
    this.closestOpponents = provinces;
    this.closestOpponentDistance = distance;
  }

  getClosestOpponentDistance() {
    return this.closestOpponentDistance;
  }

  getClosestOpponents(): BattleProvince[] {
    if (this.closestOpponents.length === 0) {
      throw new Error(`closestOpponent is not set yet`);
    }
    return this.closestOpponents;
  }

  updateOpponentCapitalDistance(distance: number) {
    this.opponentCapitalDistance = distance;
  }

  getOpponentCapitalDistance(): number {
    if (this.opponentCapitalDistance === undefined) {
      throw new Error(`opponentCapitalDistance is not set yet`);
    }
    return this.opponentCapitalDistance;
  }

  updateOwnCapitalDistance(distance: number) {
    this.ownCapitalDistance = distance;
  }

  getOwnCapitalDistance(): number {
    if (this.ownCapitalDistance === undefined) {
      throw new Error(`ownCapitalDistance is not set yet`);
    }
    return this.ownCapitalDistance;
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

  hasAnyFort(): boolean {
    return this.province.fort !== Fortification.Nothing;
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
