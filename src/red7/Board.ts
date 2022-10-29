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
      []
    );
  }

  getAllValidMoves() {
    const myCards = this.red7.getMyHand();

    const firstCard = myCards[0];
    this.red7.clickCard(firstCard.elementId);
    this.red7.clickCanvas();
  }
}
