import { ArmyMove } from "./ArmyMove";

export class ArmyMovesRecorder {
  private static MAX_MOVES_PER_TURN = 5;

  // tslint:disable-next-line: member-ordering
  armyMoves: ArmyMove[] = [];

  addMove(armyMove: ArmyMove) {
    if (this.isFull()) {
      throw new Error(`Only '${ArmyMovesRecorder.MAX_MOVES_PER_TURN}' per turn are allowed`);
    }
    this.armyMoves.push(armyMove);
  }

  isFull() {
    return this.armyMoves.length >= ArmyMovesRecorder.MAX_MOVES_PER_TURN;
  }

  getArmyMoves(): ArmyMove[] {
    // TODO: return immutable list/copy
    return this.armyMoves;
  }

  clearMoves() {
    this.armyMoves.splice(0, this.armyMoves.length);
  }
}
