import { Card } from "../Card";
import { Color } from "../Color";

class Yellow {
  constructor(bestCard: Card, bestRankCount: number) {
    this.bestCard = bestCard;
    this.bestRankCount = bestRankCount;
  }

  readonly bestCard: Card;
  readonly bestRankCount: number;
}

export class YellowRule {
  isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBest = this.getBestCard(oponentPallete);

    if (myBestCard.bestRankCount === oponentBest.bestRankCount) {
      return myBestCard.bestCard.isGreater(oponentBest.bestCard);
    }

    return myBestCard.bestRankCount > oponentBest.bestRankCount;
  }

  private getBestCard(pallete: Card[]): Yellow {
    const map = new Map<Color, Card[]>();

    // const map: Record<number, Card[]> = {};

    pallete.forEach(card => {
      if (map.get(card.color) === undefined) {
        map.set(card.color, []);
      }

      map.get(card.color)!.push(card);
    });

    let bestRank: number | undefined;
    let bestCount = -1;

    for (const [key, value] of map) {
      const cardsCount = value.length;
      if (bestRank === undefined || cardsCount > bestCount) {
        bestRank = key;
        bestCount = cardsCount;
      }
      if (cardsCount === bestCount && key > bestRank) {
        bestRank = key;
        bestCount = cardsCount;
      }
    }

    const bestCard = this.getBestColor(map.get(bestRank!)!);

    return new Yellow(bestCard, bestCount);
  }

  private getBestColor(cards: Card[]): Card {
    cards.sort((a, b) => a.compareTo(b));

    return cards[cards.length - 1];
  }
}
