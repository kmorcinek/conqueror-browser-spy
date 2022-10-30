import { Card } from "../Card";
import { Rules } from "./Rules";

class Yellow {
  constructor(bestCard: Card, bestRankCount: number) {
    this.bestCard = bestCard;
    this.bestRankCount = bestRankCount;
  }

  readonly bestCard: Card;
  readonly bestRankCount: number;
}

export class GreenRule {
  isMyPaletteBetter(myPalette: Card[], oponentPalette: Card[]) {
    const myBestCard = this.getBestCard(myPalette);
    const oponentBest = this.getBestCard(oponentPalette);

    if (myBestCard.bestRankCount === oponentBest.bestRankCount) {
      return myBestCard.bestCard.isGreater(oponentBest.bestCard);
    }

    return myBestCard.bestRankCount > oponentBest.bestRankCount;
  }

  private getBestCard(palette: Card[]): Yellow {
    const evenCards = palette.filter(card => card.rank % 2 === 0);

    return new Yellow(Rules.getBest(evenCards), evenCards.length);
  }
}
