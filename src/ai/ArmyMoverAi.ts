import { Clicker } from "../Clicker";
import { Attitude } from "../Attitude";
import { Fortification } from "../Fortification";
import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { ArmyMove } from "./ArmyMove";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";

export class ArmyMoverAi {
  private clicker: Clicker;
  private battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private armyMovesRecorder: ArmyMovesRecorder;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    armyMovesRecorder: ArmyMovesRecorder
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  moveArmies() {
    this.battleProvinceNeighborhoods.recreateNextTurn();
    let ownedProvinces = this.battleProvinceNeighborhoods.getOwnedProvinces();
    ownedProvinces = this.sortByNumberOfSoldier(ownedProvinces);
    for (const ownedProvince of ownedProvinces) {
      if (this.armyMovesRecorder.isFull()) {
        break;
      }
      this.moveArmy(ownedProvince);
    }
    this.executeMoves();
  }

  private executeMoves() {
    for (const armyMove of this.armyMovesRecorder.getArmyMoves()) {
      this.clicker.moveArmy(armyMove.source.name, armyMove.target.name, armyMove.toStay);
    }
    this.armyMovesRecorder.clearMoves();
  }

  private moveArmy(sourceProvince: BattleProvince) {
    console.log("trying to move army from " + sourceProvince.name);
    const opponentNeighbors = sourceProvince.getOpponentNeighbors();
    const neutralNeighbors = sourceProvince.getNeutralNeighbors();
    if (opponentNeighbors.length > 0) {
      this.attackNeighbors(opponentNeighbors, sourceProvince, sourceProvince.soldiers);
    } else if (neutralNeighbors.length > 0) {
      this.attackNeighbors(neutralNeighbors, sourceProvince, sourceProvince.soldiers);
    } else {
      console.log("> neighbors conquered. Moving armies");
      const closeOpponentOrNeutralNeighbors = this.battleProvinceNeighborhoods.getClosestNotConqueredNeighbors(
        sourceProvince
      );
      console.log(">> Number of closeEnemiesOrNeutral:", closeOpponentOrNeutralNeighbors.length);

      let opponentToNumber = (bp: BattleProvince) => bp.isOpponent() ? 1 : 0;
      const targetProvince  = closeOpponentOrNeutralNeighbors.sort(
        (first, second) => opponentToNumber(first) - opponentToNumber(second)
      ).reverse()[0];

      console.log(">>> Closest target:", targetProvince.name);
      let toStay = this.getNumberOfSoldiersToStay(sourceProvince);
      if (this.battleProvinceNeighborhoods.getDistance(sourceProvince, targetProvince) === 2) {
        toStay = Math.max(toStay, sourceProvince.farms);
      }
      // TODO: UT for that
      const path = this.battleProvinceNeighborhoods.getPath(sourceProvince, targetProvince);
      // TODO: when not all provinces has neighbors path sometimes have not sense
      if (path.length > 0) {
        this.moveWhenEnoughSoldier(
          sourceProvince,
          toStay,
          this.battleProvinceNeighborhoods.getByName(path[0])
        );
      }
    }
  }

  private attackNeighbors(
    notOwnedNeighbors: BattleProvince[],
    sourceProvince: BattleProvince,
    remainingSoldiers: number
  ) {
    const neighborsToAttack = this.sortByProvinceValue(notOwnedNeighbors);
    for (const neighbor of neighborsToAttack) {
      if (this.armyMovesRecorder.isFull()) {
        return;
      }
      console.log("trying to move army to      " + neighbor.name);
      const isLastProvinceToAttack = neighbor === neighborsToAttack[neighborsToAttack.length - 1];
      const target = neighbor;
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

  private moveWhenEnoughSoldier(
    sourceProvince: BattleProvince,
    toStay: number,
    target: BattleProvince
  ) {
    if (sourceProvince.soldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
    } else {
      console.log(
        `>>>> Not enough soldiers. soldier:'${sourceProvince.soldiers}', toStay:'${toStay}'`
      );
    }
  }

  // tslint:disable-next-line: member-ordering
  sortByProvinceValue(notOwnedNeighbors: BattleProvince[]) {
    return notOwnedNeighbors.sort(
      (first, second) => second.province.calculateValue() - first.province.calculateValue()
    );
  }

  private attackingSoldiersCount(
    source: BattleProvince,
    remainingSoldiers: number,
    target: BattleProvince
  ) {
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
    source: BattleProvince,
    remainingSoldiers: number,
    target: BattleProvince
  ) {
    const soldiersToStay = this.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    return soldiersReadyToAttack;
  }

  private attackFort(soldiersReadyToAttack: number, target: BattleProvince) {
    if (soldiersReadyToAttack > target.soldiers + 4) {
      return target.soldiers + 5;
    } else {
      return 0;
    }
  }

  private getNumberOfSoldiersToStay(source: BattleProvince): number {
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

  private sortByNumberOfSoldier(ownedProvinces: BattleProvince[]) {
    return ownedProvinces.sort(
      (first, second) => second.soldiers - first.soldiers
    );
  }
}
