import { Card } from "../Card";

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

  private getBestCard(pallete: Card[]): Orange {
    const map: Record<number, Card[]> = {};

    pallete.forEach(card => {
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

    const bestCard = this.getBestColor(map[bestRank!]);

    return new Orange(bestCard, bestCount);
  }

  private getBestColor(cards: Card[]): Card {
    // TODO: aggregate
    let bestCard: Card = cards[0];
    for (const card of cards) {
      if (card.color > bestCard.color) {
        bestCard = card;
      }
    }

    return bestCard;
  }
}
