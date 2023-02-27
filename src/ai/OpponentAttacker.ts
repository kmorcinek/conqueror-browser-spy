import { ArmyMove } from "./ArmyMove";
import { BattleProvince } from "./BattleProvince";
import { IArmyMovesRecorder } from "./IArmyMovesRecorder";
import { Fortification } from "../Fortification";

export class OpponentAttacker {
  private readonly armyMovesRecorder: IArmyMovesRecorder;

  constructor(armyMovesRecorder: IArmyMovesRecorder) {
    this.armyMovesRecorder = armyMovesRecorder;
  }

  attackOpponents(opponents: BattleProvince[], sourceProvince: BattleProvince) {
    function notRetreating(target: BattleProvince) {
      return (
        target.getOpponentCapitalDistance() <= sourceProvince.getOpponentCapitalDistance() &&
        target.getOwnCapitalDistance() >= sourceProvince.getOwnCapitalDistance()
      );
    }

    const opponentsByValue = this.sortByProvinceValue(opponents).filter(notRetreating);

    for (const target of opponentsByValue) {
      if (this.armyMovesRecorder.isFull()) {
        return;
      }
      console.log("Trying to move army to      " + target.name);

      // Stay in fort
      if (sourceProvince.hasAnyFort()) {
        // any of them has similar then stay
        if (
          opponents.filter(x => x.remainingSoldiers >= sourceProvince.remainingSoldiers).length > 0
        ) {
          console.log(
            `> Don't leave fort when opponents nearby of ${sourceProvince.name} are strong`,
          );
          return;
        }
      }

      const isLastProvinceToAttack = target === opponentsByValue[opponentsByValue.length - 1];
      let attackingSoldiersCount: number;
      if (isLastProvinceToAttack) {
        attackingSoldiersCount = this.attackingSoldiersCountForLastProvince(sourceProvince, target);
      } else {
        attackingSoldiersCount = this.attackingSoldiersCount(sourceProvince, target);
      }
      console.log(
        `> Attacking ${attackingSoldiersCount} soldiers from ${sourceProvince.name} to ${target.name}`,
      );
      if (attackingSoldiersCount > 0) {
        const decrementArmySize = sourceProvince.remainingSoldiers - attackingSoldiersCount;
        this.moveWhenEnoughSoldier(sourceProvince, decrementArmySize, target);
      }
    }
  }

  private attackingSoldiersCount(source: BattleProvince, target: BattleProvince) {
    const soldiersToStay = source.getNumberOfSoldiersToStayByAttitude();
    const soldiersReadyToAttack = Math.max(source.remainingSoldiers - soldiersToStay, 0);
    if (target.hasAnyFort()) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    const soldiersRequiredToConquer = this.soldierRequiredToConquer(target);
    // To limit small movements
    if (soldiersReadyToAttack < soldiersRequiredToConquer / 2) {
      return 0;
    }
    return Math.min(soldiersReadyToAttack, soldiersRequiredToConquer);
  }

  private soldierRequiredToConquer(target: BattleProvince) {
    // tslint:disable: prettier
    return (
      target.remainingSoldiers +
      2 +
      Math.floor(target.farms / 3) +
      Math.floor(target.remainingSoldiers / 9)
    );
    // tslint:enable: prettier
  }

  private attackingSoldiersCountForLastProvince(source: BattleProvince, target: BattleProvince) {
    const soldiersToStay = source.getNumberOfSoldiersToStayByAttitude();
    const soldiersReadyToAttack = Math.max(source.remainingSoldiers - soldiersToStay, 0);
    if (target.hasAnyFort()) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    const soldiersRequiredToConquer = this.soldierRequiredToConquer(target);
    if (soldiersReadyToAttack < soldiersRequiredToConquer) {
      return 0;
    }
    return soldiersReadyToAttack;
  }

  private attackFort(soldiersReadyToAttack: number, target: BattleProvince) {
    let fortOverAttack = 5 + Math.floor(target.remainingSoldiers / 5);
    if (target.fort === Fortification.Keep) {
      fortOverAttack += 4;
    }
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

  private sortByProvinceValue(notOwnedNeighbors: BattleProvince[]) {
    return notOwnedNeighbors
      .sort((first, second) => first.province.calculateValue() - second.province.calculateValue())
      .reverse();
  }

  // TODO: reuse with same method after refactoring
  private moveWhenEnoughSoldier(
    sourceProvince: BattleProvince,
    toStay: number,
    target: BattleProvince,
  ) {
    if (sourceProvince.remainingSoldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
      sourceProvince.moveOutSoldiers(sourceProvince.remainingSoldiers - toStay);
    } else {
      console.log(
        `>>>> Not enough soldiers. soldier:'${sourceProvince.remainingSoldiers}', toStay:'${toStay}'`,
      );
    }
  }
}
