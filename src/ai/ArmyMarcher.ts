import { ArmyMove } from "./ArmyMove";
import { BattleProvince } from "./BattleProvince";
import { IArmyMovesRecorder } from "./IArmyMovesRecorder";
import { IBattleProvinceNeighborhoods } from "./IBattleProvinceNeighborhoods";

export class ArmyMarcher {
  private readonly battleProvinceNeighborhoods: IBattleProvinceNeighborhoods;
  private readonly armyMovesRecorder: IArmyMovesRecorder;

  constructor(
    battleProvinceNeighborhoods: IBattleProvinceNeighborhoods,
    armyMovesRecorder: IArmyMovesRecorder
  ) {
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  marchArmy(sourceProvince: BattleProvince) {
    console.log("trying to march army from " + sourceProvince.name);
    const closeOpponentOrNeutralNeighbors = this.battleProvinceNeighborhoods.getClosestNotConqueredNeighbors(
      sourceProvince
    );
    console.log(">> Number of closeEnemiesOrNeutral:", closeOpponentOrNeutralNeighbors.length);

    const opponentToNumber = (bp: BattleProvince) => (bp.isOpponent() ? 1 : 0);
    const targetProvince = closeOpponentOrNeutralNeighbors
      .sort((first, second) => opponentToNumber(first) - opponentToNumber(second))
      .reverse()[0];

    this.marchToTarget(sourceProvince, targetProvince);
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
          targetProvince
        );
        for (const onePath of manyPath) {
          if (onePath[0].isMine()) {
            if (this.moveWhenEnoughSoldier(sourceProvince, toStay, onePath[0])) {
              console.log(`Another way was found on my own lands`);
              return;
            }
          }
        }
        console.warn(`Another way was not found`);
      }
    }
  }

  // TODO: reuse with same method after refactoring
  private moveWhenEnoughSoldier(
    sourceProvince: BattleProvince,
    toStay: number,
    target: BattleProvince
  ): boolean {
    if (sourceProvince.remainingSoldiers - toStay > 0) {
      this.armyMovesRecorder.addMove(new ArmyMove(sourceProvince, target, toStay));
      sourceProvince.moveOutSoldiers(sourceProvince.remainingSoldiers - toStay);
      return true;
    } else {
      console.log(
        `>>>> Not enough soldiers. soldier:'${sourceProvince.remainingSoldiers}', toStay:'${toStay}'`
      );
      return false;
    }
  }
}
