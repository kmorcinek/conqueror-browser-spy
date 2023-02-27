import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { ArmyMove } from "./ArmyMove";
import { BattleProvince } from "./BattleProvince";
import { Fortification } from "../Fortification";

export class NeutralAttacker {
  private readonly armyMovesRecorder: ArmyMovesRecorder;

  constructor(armyMovesRecorder: ArmyMovesRecorder) {
    this.armyMovesRecorder = armyMovesRecorder;
  }

  attackNeutrals(neutrals: BattleProvince[], sourceProvince: BattleProvince) {
    const neutralsByValue = this.sortByProvinceValue(neutrals);
    for (const target of neutralsByValue) {
      if (this.armyMovesRecorder.isFull()) {
        return;
      }
      console.log("Trying to move army to      " + target.name);

      const isLastProvinceToAttack = target === neutralsByValue[neutralsByValue.length - 1];
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
    const soldiersRequiredToConquer =
      target.remainingSoldiers +
      2 +
      Math.floor(target.farms / 3) +
      Math.floor(target.remainingSoldiers / 9);
    return Math.min(soldiersReadyToAttack, soldiersRequiredToConquer);
  }

  private attackingSoldiersCountForLastProvince(source: BattleProvince, target: BattleProvince) {
    const soldiersToStay = source.getNumberOfSoldiersToStayByAttitude();
    const soldiersReadyToAttack = Math.max(source.remainingSoldiers - soldiersToStay, 0);
    if (target.hasAnyFort()) {
      return this.attackFort(soldiersReadyToAttack, target);
    }
    return soldiersReadyToAttack;
  }

  private attackFort(soldiersReadyToAttack: number, target: BattleProvince) {
    let fortOverAttack = 4 + Math.floor(target.remainingSoldiers / 5);
    if (target.fort === Fortification.Keep) {
      fortOverAttack += 3;
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
