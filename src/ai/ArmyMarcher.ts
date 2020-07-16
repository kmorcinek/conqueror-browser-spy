import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { ArmyMove } from "./ArmyMove";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";

export class ArmyMarcher {
  private battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private armyMovesRecorder: ArmyMovesRecorder;

  constructor(
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    armyMovesRecorder: ArmyMovesRecorder
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

    console.log(">>> Closest target:", targetProvince.name);
    let toStay = sourceProvince.getNumberOfSoldiersToStayByAttitude();
    // if (sourceProvince.closestOpponentDistance === 2) {
    toStay = Math.max(toStay, sourceProvince.farms);
    // }
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

  // TODO: reuse with same method after refactoring
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
}
