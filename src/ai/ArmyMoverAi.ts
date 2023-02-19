import { Clicker } from "../Clicker";
import { ArmyMovesRecorder } from "./ArmyMovesRecorder";
import { BattleProvinceNeighborhoods } from "./BattleProvinceNeighborhoods";
import { BattleProvince } from "./BattleProvince";
import { ArmyMarcher } from "./ArmyMarcher";
import { OpponentAttacker } from "./OpponentAttacker";
import { NeutralAttacker } from "./NeutralAttacker";

export class ArmyMoverAi {
  private readonly clicker: Clicker;
  private readonly battleProvinceNeighborhoods: BattleProvinceNeighborhoods;
  private readonly armyMovesRecorder: ArmyMovesRecorder;
  private readonly opponentAttacker: OpponentAttacker;
  private readonly neutralAttacker: NeutralAttacker;
  private readonly armyMarcher: ArmyMarcher;

  constructor(
    clicker: Clicker,
    battleProvinceNeighborhoods: BattleProvinceNeighborhoods,
    armyMarcher: ArmyMarcher,
    opponentAttacker: OpponentAttacker,
    neutralAttacker: NeutralAttacker,
    armyMovesRecorder: ArmyMovesRecorder
  ) {
    this.clicker = clicker;
    this.battleProvinceNeighborhoods = battleProvinceNeighborhoods;
    this.armyMarcher = armyMarcher;
    this.opponentAttacker = opponentAttacker;
    this.neutralAttacker = neutralAttacker;
    this.armyMovesRecorder = armyMovesRecorder;
  }

  moveArmies() {
    // TODO: reset() fot this stuff
    this.armyMovesRecorder.clearMoves();

    let ownedProvinces = this.battleProvinceNeighborhoods.getOwnedProvinces();
    ownedProvinces = this.sortByNumberOfSoldier(ownedProvinces);
    this.logOrderOfProvinces(ownedProvinces);
    for (const ownedProvince of ownedProvinces) {
      if (this.armyMovesRecorder.isFull()) {
        break;
      }
      this.moveArmy(ownedProvince);
    }
    this.validateMoves();
    this.executeMoves();
  }

  validateMoves() {
    // throw new Error("Method not implemented.");
    real code
  }

  private executeMoves() {
    for (const armyMove of this.armyMovesRecorder.getArmyMoves()) {
      this.clicker.moveArmy(armyMove.source.name, armyMove.target.name, armyMove.toStay);
    }
    this.armyMovesRecorder.clearMoves();
  }

  private moveArmy(sourceProvince: BattleProvince) {
    console.log("Trying to move army from " + sourceProvince.name);
    const opponentNeighbors = sourceProvince.getOpponentNeighbors();
    const neutralNeighbors = sourceProvince.getNeutralNeighbors();
    if (opponentNeighbors.length > 0) {
      this.opponentAttacker.attackOpponents(opponentNeighbors, sourceProvince);
    } else if (neutralNeighbors.length > 0) {
      if (sourceProvince.getClosestOpponentDistance() === 2) {
        console.log("> Instead of attacking neutral move closer to near (2 distance) opponent");
        this.armyMarcher.marchToPossibleTargets(
          sourceProvince,
          sourceProvince.getClosestOpponents()
        );
      } else {
        this.neutralAttacker.attackNeutrals(neutralNeighbors, sourceProvince);
      }
    } else {
      console.log("> Close neighbors already conquered. Moving armies");
      this.armyMarcher.marchArmy(sourceProvince);
    }
  }

  // tslint:disable-next-line: member-ordering
  sortByProvinceValue(notOwnedNeighbors: BattleProvince[]) {
    return notOwnedNeighbors
      .sort((first, second) => first.province.calculateValue() - second.province.calculateValue())
      .reverse();
  }

  private sortByNumberOfSoldier(ownedProvinces: BattleProvince[]) {
    return ownedProvinces.sort(
      (first, second) => second.remainingSoldiers - first.remainingSoldiers
    );
  }

  private logOrderOfProvinces(ownedProvinces: BattleProvince[]) {
    const names = ownedProvinces.map(x => x.name);
    console.log(`Sorted provinces by number of soldiers`, names);
  }
}
