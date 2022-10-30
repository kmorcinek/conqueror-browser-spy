import { Card } from "../Card";

export class RedRule {
  isMyPaletteBetter(myPalette: Card[], opponentPalette: Card[]) {
    const myBestCard = this.getBestCard(myPalette);
    const opponentBest = this.getBestCard(opponentPalette);
    const isX = myBestCard.rank === opponentBest.rank && myBestCard.color > opponentBest.color;

    return myBestCard.rank > opponentBest.rank || isX;
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
