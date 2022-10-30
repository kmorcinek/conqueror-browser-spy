import { Board } from "./Board";
import { ChangeRuleMove } from "./ChangeRuleMove";
import { MoveToPallete } from "./MoveToPalette";
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
    // TODO: maybe start from small cards to have higher for later use
    boardState.myHand.forEach(cardInHand => {
      if (cardInHand.rank !== 1 && cardInHand.rank !== 5 && cardInHand.rank !== 7) {
        const move = new MoveToPallete(cardInHand);
        const newBoard = boardState.applyMove(move);
        if (newBoard.isMyPalleteBetter()) {
          this.red7.moveToPallete(move);

          return;
        }
      }

      // const move = new ChangeRuleMove(cardInHand);
      // const newBoard = boardState.applyMove(move);
      // if (newBoard.isMyPalleteBetter()) {
      //   this.red7.moveToPallete(move);

      //   return;
      // }
    });
  }
}
