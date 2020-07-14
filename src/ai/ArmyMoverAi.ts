import { Clicker } from "../Clicker";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "../ProvinceNeighborhoods";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { Province } from "../Province";
import { Attitude } from "../Attitude";
import { Fortification } from "../Fortification";

export class ArmyMoverAi {
  static attackingSoldiersCount(source: Province, remainingSoldiers: number, target: Province) {
    const soldiersToStay = ArmyMoverAi.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return ArmyMoverAi.attackFort(soldiersReadyToAttack, target);
    }
    const soldiersToConquer =
      target.soldiers + 2 + Math.floor(target.farms / 3) + Math.floor(target.soldiers + 1 / 9);
    return Math.min(soldiersReadyToAttack, soldiersToConquer);
  }

  static attackingSoldiersCountForLastProvince(
    source: Province,
    remainingSoldiers: number,
    target: Province
  ) {
    const soldiersToStay = ArmyMoverAi.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return ArmyMoverAi.attackFort(soldiersReadyToAttack, target);
    }
    return soldiersReadyToAttack;
  }

  static attackFort(soldiersReadyToAttack: number, target: Province) {
    if (soldiersReadyToAttack > target.soldiers + 4) {
      return target.soldiers + 5;
    } else {
      return 0;
    }
  }

  private static getNumberOfSoldiersToStay(source: Province): number {
    switch (source.attitude) {
      case Attitude.Rebellious:
      case Attitude.Restless:
        return Math.ceil(source.farms / 2);
      case Attitude.Content:
        return Math.ceil(source.farms / 4);
      case Attitude.Supportive:
      case Attitude.Devoted:
        return 0;
      default:
        console.error("Missing Attitude");
        throw new Error("Missing Attitude");
    }
  }

  private clicker: Clicker;
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceNeighborhoods: ProvinceNeighborhoods;
  private provinceHistoryService: ProvinceHistoryService;

  constructor(
    clicker: Clicker,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceNeighborhoods: ProvinceNeighborhoods,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.clicker = clicker;
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
    this.provinceNeighborhoods = provinceNeighborhoods;
    this.provinceHistoryService = provinceHistoryService;
  }

  moveArmies() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      this.moveArmy(ownedProvince);
    }
  }

  private moveArmy(sourceProvinceName: string) {
    console.log("trying to move army from " + sourceProvinceName);
    const sourceProvince = this.provinceHistoryService.getByName(sourceProvinceName).getLast();
    const neighbors = this.provinceNeighborhood.getNeighbors(sourceProvinceName);
    const opponentNeighbors = this.provinceOwnership.filterOpponents(neighbors);
    const neutralNeighbors = this.provinceOwnership.filterNeutral(neighbors);
    if (opponentNeighbors.length > 0) {
      this.attackNeighbors(opponentNeighbors, sourceProvince, sourceProvince.soldiers);
    } else if (neutralNeighbors.length > 0) {
      this.attackNeighbors(neutralNeighbors, sourceProvince, sourceProvince.soldiers);
    } else {
      console.log("> neighbors conquered. Moving armies");
      const closeEnemiesOrNeutral = this.provinceNeighborhoods.getCloseNotConqueredNeighbors(
        sourceProvinceName
      );
      console.log("> Number of closeEnemiesOrNeutral:", closeEnemiesOrNeutral.length);
      const targetProvince = closeEnemiesOrNeutral[0];
      console.log("> Closest target:", targetProvince);
      let toStay = ArmyMoverAi.getNumberOfSoldiersToStay(sourceProvince);
      if (this.provinceNeighborhood.getDistance(sourceProvince.name, targetProvince) === 2) {
        toStay = Math.max(toStay, sourceProvince.farms);
      }
      // TODO: UT for that
      const path = this.provinceNeighborhood.getPath(sourceProvince.name, targetProvince);
      // TODO: when not all provinces has neighbors path sometimes have not sense
      if (path.length > 0) {
        this.moveWhenEnoughSoldier(sourceProvince, toStay, path[0]);
      }
    }
  }

  private moveWhenEnoughSoldier(sourceProvince: Province, toStay: number, target: string) {
    if (sourceProvince.soldiers - toStay > 0) {
      this.clicker.moveArmy(sourceProvince.name, target, toStay);
    } else {
      console.log(
        `> Not enough soldiers. soldier:'${sourceProvince.soldiers}', toStay:'${toStay}'`
      );
    }
  }

  private attackNeighbors(
    notOwnedNeighbors: string[],
    sourceProvince: Province,
    remainingSoldiers: number
  ) {
    const neighborsToAttack = this.sortByProvinceValue(notOwnedNeighbors);
    for (const neighbor of neighborsToAttack) {
      console.log("trying to move army to      " + neighbor);
      const isLastProvinceToAttack = neighbor === neighborsToAttack[neighborsToAttack.length - 1];
      const target = this.provinceHistoryService.getByName(neighbor).getLast();
      let attackingSoldiersCount: number;
      if (isLastProvinceToAttack) {
        attackingSoldiersCount = ArmyMoverAi.attackingSoldiersCountForLastProvince(
          sourceProvince,
          remainingSoldiers,
          target
        );
      } else {
        attackingSoldiersCount = ArmyMoverAi.attackingSoldiersCount(
          sourceProvince,
          remainingSoldiers,
          target
        );
      }
      console.log(
        `> Attacking ${attackingSoldiersCount} soldiers from ${sourceProvince.name} to ${target.name}`
      );
      if (attackingSoldiersCount > 0) {
        const decrementArmySize = remainingSoldiers - attackingSoldiersCount;
        this.moveWhenEnoughSoldier(sourceProvince, decrementArmySize, neighbor);
        remainingSoldiers -= attackingSoldiersCount;
      }
    }
  }

  // tslint:disable-next-line: member-ordering
  sortByProvinceValue(notOwnedNeighbors: string[]) {
    return notOwnedNeighbors.sort(
      (first, second) => this.calculateProvinceValue(second) - this.calculateProvinceValue(first)
    );
  }

  private calculateProvinceValue(provinceName: string) {
    return this.provinceHistoryService
      .getByName(provinceName)
      .getLast()
      .calculateValue();
  }
}
