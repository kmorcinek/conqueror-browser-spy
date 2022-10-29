import { Card } from "../Card";

export class RedRule {
  static isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBest = this.getBestCard(oponentPallete);
    const isX = myBestCard.rank === oponentBest.rank && myBestCard.color > oponentBest.color;

    return myBestCard.rank > oponentBest.rank || isX;
  }

  private static getBestCard(pallete: Card[]) {
    let bestCard = pallete[0];

    pallete.forEach(card => {
      if (card.rank > bestCard.rank) {
        bestCard = card;
      }

      if (card.rank === bestCard.rank && card.color > bestCard.color) {
        bestCard = card;
      }
    });

    return bestCard;
  }
}
