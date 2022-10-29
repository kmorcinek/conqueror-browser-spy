import { Card } from "../Card";

export class RedRule {
  static isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBestCard = this.getBestCard(oponentPallete);
    return myBestCard.rank > oponentBestCard.rank;
    // Compare colors
  }

  private static getBestCard(pallete: Card[]) {
    let bestCard = pallete[0];

    pallete.forEach(card => {
      if (card.rank > bestCard.rank) {
        bestCard = card;
      }

      // TODO compare colors
    });

    return bestCard;
  }
}
