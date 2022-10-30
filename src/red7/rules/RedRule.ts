import { Card } from "../Card";

export class RedRule {
  isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBest = this.getBestCard(oponentPallete);
    const isX = myBestCard.rank === oponentBest.rank && myBestCard.color > oponentBest.color;

    return myBestCard.rank > oponentBest.rank || isX;
  }

  private getBestCard(palette: Card[]) {
    let bestCard = palette[0];

    palette.forEach(card => {
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
