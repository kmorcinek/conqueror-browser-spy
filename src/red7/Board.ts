import { BoardState } from "./BoardState";
import { Red7 } from "./Red7";

export class Board {
  private readonly red7: Red7;

  constructor(red7: Red7) {
    this.red7 = red7;
  }

  getCurrentBoardState() {
    return new BoardState(
      this.red7.getCurrentRule(),
      this.red7.getMyHand(),
      this.red7.getMyPallete(),
      this.red7.getOponentPallete()
    );
  }

  getAllValidMoves() {
    const myCards = this.red7.getMyHand();
  }
}
