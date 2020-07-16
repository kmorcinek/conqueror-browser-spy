import { Clicker } from "../Clicker";
import { Fortification } from "../Fortification";
import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { ArmyMove } from "./ArmyMove";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";
import { ArmyMarcher } from "./ArmyMarcher";

export class ArmyMoverAi {
  private readonly clicker: Clicker;
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly armyMovesRecorder: ArmyMovesRecorder;
  private readonly armyMarcher: ArmyMarcher;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    armyMarcher: ArmyMarcher,
    armyMovesRecorder: ArmyMovesRecorder
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMarcher = armyMarcher;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  moveArmies() {
    // TODO: reset() fot this stuff
    this.armyMovesRecorder.clearMoves();

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
      this.attackNeighbors(opponentNeighbors, sourceProvince);
    } else if (neutralNeighbors.length > 0) {
      this.attackNeighbors(neutralNeighbors, sourceProvince);
    } else {
      console.log("> close neighbors already conquered. Moving armies");
      this.armyMarcher.marchArmy(sourceProvince);
    }
  }

  private attackNeighbors(
    notOwnedNeighbors: BattleProvince[],
    sourceProvince: BattleProvince
  ) {
    const neighborsToAttack = this.sortByProvinceValue(notOwnedNeighbors);
    for (const target of neighborsToAttack) {
      if (this.armyMovesRecorder.isFull()) {
        return;
      }
      console.log("trying to move army to      " + target.name);
      const isLastProvinceToAttack = target === neighborsToAttack[neighborsToAttack.length - 1];

      // Stay in fort
      if (sourceProvince.fort !== Fortification.Nothing && target.isOpponent()) {
        // any of them has similar then stay
        if (
          neighborsToAttack.filter(x => x.remainingSoldiers >= sourceProvince.remainingSoldiers)
            .length > 0
        ) {
          console.log(
            `> don't leave fort when opponents nearby of ${sourceProvince.name} are strong`
          );
          return;
        }
      }

      let attackingSoldiersCount: number;
      if (isLastProvinceToAttack) {
        attackingSoldiersCount = this.attackingSoldiersCountForLastProvince(
          sourceProvince,
          target
        );
      } else {
        attackingSoldiersCount = this.attackingSoldiersCount(
          sourceProvince,
          target
        );
      }
      console.log(
        `> Attacking ${attackingSoldiersCount} soldiers from ${sourceProvince.name} to ${target.name}`
      );
      if (attackingSoldiersCount > 0) {
        const decrementArmySize = sourceProvince.remainingSoldiers - attackingSoldiersCount;
        this.moveWhenEnoughSoldier(sourceProvince, decrementArmySize, target);
      }
    }
  }

  // TODO: this method is not correct as .soldiers is only the initial value, later can be decreased by other moves
  // this is where is a bug, later "decrease" button cannot be clicked.
  // .initialSoldiers vs .remainingSoldiers.
  private moveWhenEnoughSoldier(
    sourceProvince: BattleProvince,
    toStay: number,
    target: BattleProvince
  ) {
    if (sourceProvince.remainingSoldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
      sourceProvince.moveOutSoldiers(sourceProvince.remainingSoldiers - toStay);
    } else {
      console.log(
        `>>>> Not enough soldiers. soldier:'${sourceProvince.remainingSoldiers}', toStay:'${toStay}'`
      );
    }
  }

  // tslint:disable-next-line: member-ordering
  sortByProvinceValue(notOwnedNeighbors: BattleProvince[]) {
    return notOwnedNeighbors
      .sort((first, second) => first.province.calculateValue() - second.province.calculateValue())
      .reverse();
  }

  private attackingSoldiersCount(
    source: BattleProvince,
    target: BattleProvince
  ) {
    const remainingSoldiers = source.remainingSoldiers;
    const soldiersToStay = source.getNumberOfSoldiersToStayByAttitude();
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    const soldiersRequiredToConquer =
      target.remainingSoldiers +
      2 +
      Math.floor(target.farms / 3) +
      Math.floor(target.remainingSoldiers + 1 / 9);
    return Math.min(soldiersReadyToAttack, soldiersRequiredToConquer);
  }

  private attackingSoldiersCountForLastProvince(
    source: BattleProvince,
    target: BattleProvince
  ) {
    const remainingSoldiers = source.remainingSoldiers;
    const soldiersToStay = source.getNumberOfSoldiersToStayByAttitude();
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    if (target.fort !== Fortification.Nothing) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    return soldiersReadyToAttack;
  }

  private attackFort(soldiersReadyToAttack: number, target: BattleProvince) {
    const fortOverAttack = 5 + Math.floor(target.remainingSoldiers / 5);
    if (soldiersReadyToAttack >= target.remainingSoldiers + fortOverAttack) {
      // Attack Opponent with everything
      if (target.isOpponent()) {
        return soldiersReadyToAttack;
      }
      return target.remainingSoldiers + fortOverAttack;
    } else {
      return 0;
    }
  }

  private sortByNumberOfSoldier(ownedProvinces: BattleProvince[]) {
    return ownedProvinces.sort(
      (first, second) => second.remainingSoldiers - first.remainingSoldiers
    );
  }
}
