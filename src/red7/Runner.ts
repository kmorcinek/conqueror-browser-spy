import { Red7 } from "./Red7";

export class Runner {
  private readonly red7: Red7;

  constructor(red7: Red7) {
    this.red7 = red7;
  }

  giveFirstCardToCanvas() {
    const myCards = this.red7.getMyHand();

    const firstCard = myCards[0];
    this.red7.clickCard(firstCard);
    this.red7.clickCanvas();
  }
}
