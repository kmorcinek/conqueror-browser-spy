import { Card } from "../Card";
import { Rules } from "./Rules";

class Orange {
  constructor(bestCard: Card, bestRankCount: number) {
    this.bestCard = bestCard;
    this.bestRankCount = bestRankCount;
  }

  readonly bestCard: Card;
  readonly bestRankCount: number;
}

export class OrangeRule {
  isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBest = this.getBestCard(oponentPallete);

    if (myBestCard.bestRankCount === oponentBest.bestRankCount) {
      return myBestCard.bestCard.isGreater(oponentBest.bestCard);
    }

    return myBestCard.bestRankCount > oponentBest.bestRankCount;
  }

  private getBestCard(palette: Card[]): Orange {
    const map: Record<number, Card[]> = {};

    palette.forEach(card => {
      if (map[card.rank] === undefined) {
        map[card.rank] = [];
      }

      map[card.rank].push(card);
    });

    let bestRank: number | undefined;
    let bestCount = -1;

    const keys = Object.keys(map);
    for (const i of keys) {
      const key: number = parseInt(i);
      const cardsCount = map[key].length;
      if (bestRank === undefined || cardsCount > bestCount) {
        bestRank = key;
        bestCount = cardsCount;
      }
      if (cardsCount === bestCount && key > bestRank) {
        bestRank = key;
        bestCount = cardsCount;
      }
    }

    const bestCard = Rules.getBest(map[bestRank!]);

    return new Orange(bestCard, bestCount);
  }
}
