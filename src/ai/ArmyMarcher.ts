import { ArmyMove } from "./ArmyMove";
import { BattleProvince } from "./BattleProvince";
import { IArmyMovesRecorder } from "./IArmyMovesRecorder";
import { IBattleProvinceNeighborhoods } from "./IBattleProvinceNeighborhoods";

export class ArmyMarcher {
  private readonly battleProvinceNeighborhoods: IBattleProvinceNeighborhoods;
  private readonly armyMovesRecorder: IArmyMovesRecorder;

  constructor(
    battleProvinceNeighborhoods: IBattleProvinceNeighborhoods,
    armyMovesRecorder: IArmyMovesRecorder,
  ) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  marchArmy(sourceProvince: BattleProvince) {
    console.log("Trying to march army from " + sourceProvince.name);
    const closeOpponentOrNeutralNeighbors = this.battleProvinceNeighborhoods.getClosestNotConqueredNeighbors(
      sourceProvince,
    );

    if (closeOpponentOrNeutralNeighbors.length) {
      console.log(
        ">> Number of closeOpponentOrNeutralNeighbors:",
        closeOpponentOrNeutralNeighbors.length,
      );
    } else {
      console.warn(">> Missing closeOpponentOrNeutralNeighbors");
    }

    const opponentToNumber = (bp: BattleProvince) => (bp.isOpponent() ? 1 : 0);
    const targetProvince = closeOpponentOrNeutralNeighbors
      .sort((first, second) => opponentToNumber(first) - opponentToNumber(second))
      .reverse()[0];

    this.marchToTarget(sourceProvince, targetProvince);
  }

  marchToPossibleTargets(sourceProvince: BattleProvince, possibleTargets: BattleProvince[]) {
    // TODO: for now choosing only first target
    this.marchToTarget(sourceProvince, possibleTargets[0]);
  }

  marchToTarget(sourceProvince: BattleProvince, targetProvince: BattleProvince) {
    console.log(">>> Closest target:", targetProvince.name);
    // TODO: UT for that
    const path = this.battleProvinceNeighborhoods.getPath(sourceProvince, targetProvince);
    // TODO: when not all provinces has neighbors path sometimes have not sense
    if (path.length === 0) {
      return;
    }

    let toStay = sourceProvince.getNumberOfSoldiersToStayByAttitude();
    // if (sourceProvince.closestOpponentDistance === 2) {
    toStay = Math.max(toStay, sourceProvince.farms);
    // }
    const middleTarget = this.battleProvinceNeighborhoods.getByName(path[0]);
    if (middleTarget.isMine()) {
      this.moveWhenEnoughSoldier(sourceProvince, toStay, middleTarget);
    } else {
      console.log(`Standard path is not leading on my own lands`);
      if (this.battleProvinceNeighborhoods.getDistance(sourceProvince, targetProvince) === 2) {
        const manyPath = this.battleProvinceNeighborhoods.getManyPathWithDistance2(
          sourceProvince,
          targetProvince,
        );
        // we only sort by soldiers, not important is Neutral vs Mine, cause if empty it may be fine to
        // attach first the neutral, cause our move to Mine can be too late (overtake by Opponent)
        const sortedPathByBeingEmpty = ArmyMarcher.sortByLessSoldiersInNextTarget(manyPath);
        for (const onePath of sortedPathByBeingEmpty) {
          const middleTargetProvince = onePath[0];
          // We attack empty neutral, even if this class should only move armies on my territory
          if (middleTargetProvince.isNeutral() && middleTargetProvince.remainingSoldiers === 0) {
            if (this.moveWhenEnoughSoldier(sourceProvince, toStay, middleTargetProvince)) {
              console.log(`Another way was found through empty neutral province`);
              return;
            }
          }

          if (middleTargetProvince.isMine()) {
            if (this.moveWhenEnoughSoldier(sourceProvince, toStay, middleTargetProvince)) {
              console.log(`Another way was found on my own lands`);
              return;
            }
          }
        }
        console.warn(`Another way was not found`);
      }
    }
  }

  static sortByLessSoldiersInNextTarget(manyPath: BattleProvince[][]) {
    return manyPath.sort(
      (first, second) => first[0].remainingSoldiers - second[0].remainingSoldiers,
    );
  }

  // TODO: reuse with same method after refactoring
  private moveWhenEnoughSoldier(
    sourceProvince: BattleProvince,
    toStay: number,
    target: BattleProvince,
  ): boolean {
    if (sourceProvince.remainingSoldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
      sourceProvince.moveOutSoldiers(sourceProvince.remainingSoldiers - toStay);
      return true;
    } else {
      console.log(
        `>>>> Not enough soldiers. soldier:'${sourceProvince.remainingSoldiers}', toStay:'${toStay}'`,
      );
      return false;
    }
  }
}
