import { Clicker } from "../Clicker";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "../ProvinceNeighborhoods";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { Province } from "../Province";
import { Attitude } from "../Attitude";
import { Fortification } from "../Fortification";
import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { ArmyMove } from "./ArmyMove";

export class ArmyMoverAi {
  private clicker: Clicker;
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceNeighborhoods: ProvinceNeighborhoods;
  private provinceHistoryService: ProvinceHistoryService;
  private armyMovesRecorder: ArmyMovesRecorder;

  constructor(
    clicker: Clicker,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceNeighborhoods: ProvinceNeighborhoods,
    provinceHistoryService: ProvinceHistoryService,
    armyMovesRecorder: ArmyMovesRecorder
  ) {
    this.clicker = clicker;
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
    this.provinceNeighborhoods = provinceNeighborhoods;
    this.provinceHistoryService = provinceHistoryService;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  moveArmies() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      if (this.armyMovesRecorder.isFull()) {
        break;
      }
      this.moveArmy(ownedProvince);
    }

    for (const armyMove of this.armyMovesRecorder.getArmyMoves()) {
      this.clicker.moveArmy(armyMove.source.name, armyMove.target, armyMove.toStay);
    }
    this.armyMovesRecorder.clearMoves();
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
      let toStay = this.getNumberOfSoldiersToStay(sourceProvince);
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

  private attackNeighbors(
    notOwnedNeighbors: string[],
    sourceProvince: Province,
    remainingSoldiers: number
  ) {
    const neighborsToAttack = this.sortByProvinceValue(notOwnedNeighbors);
    for (const neighbor of neighborsToAttack) {
      if (this.armyMovesRecorder.isFull()) {
        return;
      }
      console.log("trying to move army to      " + neighbor);
      const isLastProvinceToAttack = neighbor === neighborsToAttack[neighborsToAttack.length - 1];
      const target = this.provinceHistoryService.getByName(neighbor).getLast();
      let attackingSoldiersCount: number;
      if (isLastProvinceToAttack) {
        attackingSoldiersCount = this.attackingSoldiersCountForLastProvince(
          sourceProvince,
          remainingSoldiers,
          target
        );
      } else {
        attackingSoldiersCount = this.attackingSoldiersCount(
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

  private moveWhenEnoughSoldier(sourceProvince: Province, toStay: number, target: string) {
    if (sourceProvince.soldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
    } else {
      console.log(
        `> Not enough soldiers. soldier:'${sourceProvince.soldiers}', toStay:'${toStay}'`
      );
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

  private attackingSoldiersCount(source: Province, remainingSoldiers: number, target: Province) {
    const soldiersToStay = this.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    const soldiersToConquer =
      target.soldiers + 2 + Math.floor(target.farms / 3) + Math.floor(target.soldiers + 1 / 9);
    return Math.min(soldiersReadyToAttack, soldiersToConquer);
  }

  private attackingSoldiersCountForLastProvince(
    source: Province,
    remainingSoldiers: number,
    target: Province
  ) {
    const soldiersToStay = this.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    return soldiersReadyToAttack;
  }

  private attackFort(soldiersReadyToAttack: number, target: Province) {
    if (soldiersReadyToAttack > target.soldiers + 4) {
      return target.soldiers + 5;
    } else {
      return 0;
    }
  }

  private getNumberOfSoldiersToStay(source: Province): number {
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
}
