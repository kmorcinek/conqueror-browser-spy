import { Board } from "./Board";
import { Red7 } from "./Red7";

export class Runner {
  private readonly red7: Red7;
  private readonly board: Board;

  constructor(red7: Red7, board: Board) {
    this.red7 = red7;
    this.board = board;
  }

  giveFirstCardToCanvas() {
    const boardState = this.board.getCurrentBoardState();
    // const myCards = this.red7.getMyHand();

    // const firstCard = myCards[0];
    // this.red7.clickCard(firstCard.elementId);
    // this.red7.clickCanvas();
  }
}
