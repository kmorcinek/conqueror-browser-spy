import { BattleProvince } from "./BattleProvince";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "../ProvinceNeighborhoods";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { ProvinceOwner } from "../ProvinceOwner";
import { IBattleProvinceNeighborhoods } from "./IBattleProvinceNeighborhoods";
import { Settings } from "../Settings";

export class BattleProvinceNeighborhoods implements IBattleProvinceNeighborhoods {
  private readonly settings: Settings;
  private readonly provinceOwnership: IProvinceOwnership;
  private readonly provinceNeighborhood: ProvinceNeighborhood;
  private readonly provinceNeighborhoods: ProvinceNeighborhoods;
  private readonly provinceHistoryService: ProvinceHistoryService;

  private battleProvinces: Record<string, BattleProvince> = {};
  private ownedBattleProvinces: BattleProvince[] = [];
  private opponentProvinces: BattleProvince[] = [];

  constructor(
    settings: Settings,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceNeighborhoods: ProvinceNeighborhoods,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.settings = settings;
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

    this.createNeighbors(this.provinceOwnership.getAllProvinces());
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
    return this.getByNames(closeNotConqueredNeighborNames);
  }

  getDistance(source: BattleProvince, target: BattleProvince): number {
    return this.provinceNeighborhood.getDistance(source.name, target.name);
  }

  getPath(source: BattleProvince, target: BattleProvince): string[] {
    return this.provinceNeighborhood.getPath(source.name, target.name);
  }

  getManyPathWithDistance2(source: BattleProvince, target: BattleProvince): BattleProvince[][] {
    return this.provinceNeighborhood
      .getManyPathWithDistance2(source.name, target.name)
      .map(first => this.getByNames(first));
  }

  private getByNames(names: string[]): BattleProvince[] {
    return names.map(name => this.getByName(name));
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
    const opponentCapital = this.settings.getOpponentCapital();
    const ownCapital = this.settings.getMyCapital();
    for (const provinceName of ownedProvinces) {
      const battleProvince = this.battleProvinces[provinceName];

      const neighborsNames = this.provinceNeighborhood.getNeighbors(provinceName);

      // TODO: to map
      for (const neighborName of neighborsNames) {
        const neighborBattleProvince = this.battleProvinces[neighborName];
        if (neighborBattleProvince === undefined) {
          throw new Error(`Neighbor with name '${neighborName}' is not yet in battleProvinces`);
        }
        battleProvince.addNeighbor(neighborBattleProvince);
      }

      const closestOpponents = this.getClosestOpponents(battleProvince);
      const distance = this.getDistance(battleProvince, closestOpponents[0]);
      battleProvince.updateClosestOpponents(closestOpponents, distance);
      battleProvince.updateOpponentCapitalDistance(
        this.provinceNeighborhood.getDistance(provinceName, opponentCapital)
      );
      battleProvince.updateOwnCapitalDistance(
        this.provinceNeighborhood.getDistance(provinceName, ownCapital)
      );
    }
  }

  private getClosestOpponents(province: BattleProvince): BattleProvince[] {
    let smallestDistance: number = 300;
    let closestOpponents: BattleProvince[] = [];
    for (const neighbor of this.opponentProvinces) {
      const distance = this.getDistance(province, neighbor);

      if (distance < smallestDistance) {
        smallestDistance = distance;
        closestOpponents = [neighbor];
      } else if (distance === smallestDistance) {
        closestOpponents.push(neighbor);
      }
    }

    if (closestOpponents.length === 0) {
      throw new Error(`At least one opponent province have to be present`);
    }
    return closestOpponents;
  }

  private reset() {
    this.battleProvinces = {};
    this.ownedBattleProvinces.splice(0, this.ownedBattleProvinces.length);
    console.log("after reset", this.ownedBattleProvinces.length)
    this.opponentProvinces.splice(0, this.opponentProvinces.length);
  }
}
