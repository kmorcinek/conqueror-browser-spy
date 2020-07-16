import { ArmyMove } from "./ArmyMove";

export class ArmyMovesRecorder {
  private static MAX_MOVES_PER_TURN = 5;

  // tslint:disable-next-line: member-ordering
  private readonly armyMoves: ArmyMove[] = [];

  addMove(armyMove: ArmyMove) {
    if (this.isFull()) {
      throw new Error(`Only '${ArmyMovesRecorder.MAX_MOVES_PER_TURN}' per turn are allowed`);
    }
    console.log(
      `>>>> adding move from ${armyMove.source.name} to ${armyMove.target.name}, army size ${armyMove.armySize} or less`
    );
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
