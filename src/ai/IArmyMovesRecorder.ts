import { ArmyMove } from "./ArmyMove";

export interface IArmyMovesRecorder {
  addMove(armyMove: ArmyMove): void;
  isFull(): boolean;
  getArmyMoves(): ArmyMove[];
  clearMoves(): void;
}
