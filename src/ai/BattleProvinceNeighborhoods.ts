import { BattleProvince } from "./BattleProvince";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "../ProvinceNeighborhoods";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { ProvinceOwner } from "../ProvinceOwner";

export class BattleProvinceNeighborhoods {
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceNeighborhoods: ProvinceNeighborhoods;
  private provinceHistoryService: ProvinceHistoryService;

  private battleProvinces: Record<string, BattleProvince> = {};
  private ownedBattleProvinces: BattleProvince[] = [];
  private opponentProvinces: BattleProvince[] = [];

  constructor(
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceNeighborhoods: ProvinceNeighborhoods,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
    this.provinceNeighborhoods = provinceNeighborhoods;
    this.provinceHistoryService = provinceHistoryService;
  }

  recreateNextTurn() {
    this.reset();
    // all provinces, throw when duplicates
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    this.ownedBattleProvinces = this.createBattleProvinces(ownedProvinces, ProvinceOwner.Me);

    this.opponentProvinces = this.createBattleProvinces(
      this.provinceOwnership.getOpponentProvinces(),
      ProvinceOwner.Opponent
    );

    this.createBattleProvinces(this.provinceOwnership.getNeutralProvinces(), ProvinceOwner.Neutral);

    this.createNeighbors(ownedProvinces);
  }

  getOwnedProvinces(): BattleProvince[] {
    return this.ownedBattleProvinces;
  }

  getByName(name: string): BattleProvince {
    return this.battleProvinces[name];
  }

  getClosestNotConqueredNeighbors(battleProvince: BattleProvince): BattleProvince[] {
    const closeNotConqueredNeighborNames = this.provinceNeighborhoods.getCloseNotConqueredNeighbors(
      battleProvince.name
    );
    return closeNotConqueredNeighborNames.map(name => {
      return this.battleProvinces[name];
    });
  }

  getDistance(source: BattleProvince, target: BattleProvince): number {
    return this.provinceNeighborhood.getDistance(source.name, target.name);
  }

  getPath(source: BattleProvince, target: BattleProvince): string[] {
    return this.provinceNeighborhood.getPath(source.name, target.name);
  }

  private createBattleProvinces(
    provinces: string[],
    provinceOwner: ProvinceOwner
  ): BattleProvince[] {
    const newBattleProvinces: BattleProvince[] = [];
    for (const provinceName of provinces) {
      const sourceProvince = this.getProvinceByName(provinceName);
      if (this.battleProvinces[provinceName] !== undefined) {
        throw new Error(`province '${provinceName}' already exists in battle provinces`);
      }
      const battleProvince = new BattleProvince(sourceProvince, provinceOwner);
      this.battleProvinces[provinceName] = battleProvince;
      newBattleProvinces.push(battleProvince);
    }

    return newBattleProvinces;
  }

  private getProvinceByName(provinceName: string) {
    return this.provinceHistoryService.getByName(provinceName).getLast();
  }

  private createNeighbors(ownedProvinces: string[]) {
    for (const provinceName of ownedProvinces) {
      const battleProvince = this.battleProvinces[provinceName];

      const neighbors = this.provinceNeighborhood.getNeighbors(provinceName);

      for (const neighborName of neighbors) {
        const neighborBattleProvince = this.battleProvinces[neighborName];
        if (neighborBattleProvince === undefined) {
          throw new Error(`neighbor with name '${neighborName}' is not yet in battleProvinces`);
        }
        battleProvince.addNeighbor(neighborBattleProvince);
      }

      const closestOpponent = this.getClosestOpponent(battleProvince);
      const distance = this.getDistance(battleProvince, closestOpponent);
      battleProvince.updateClosestOpponent(closestOpponent, distance);
    }
  }

  private getClosestOpponent(province: BattleProvince): BattleProvince {
    let smallestDistance: number = 300;
    let closestOpponent;
    for (const neighbor of this.opponentProvinces) {
      const distance = this.getDistance(province, neighbor);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestOpponent = neighbor;
      }
    }

    if (closestOpponent === undefined) {
      throw new Error(`at least one opponent province have to be present`);
    }
    return closestOpponent;
  }

  private reset() {
    this.battleProvinces = {};
    this.ownedBattleProvinces.splice(0, this.ownedBattleProvinces.length);
  }
}
