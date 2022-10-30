import { Card } from "../Card";
import { Color } from "../Color";
import { Rules } from "./Rules";
import { Rule } from "./Rule";

class Yellow {
  constructor(bestCard: Card, bestRankCount: number) {
    this.bestCard = bestCard;
    this.bestRankCount = bestRankCount;
  }

  readonly bestCard: Card;
  readonly bestRankCount: number;
}

export class YellowRule implements Rule {
  isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]) {
    const myBestCard = this.getBestCard(myPallete);
    const oponentBest = this.getBestCard(oponentPallete);

    if (myBestCard.bestRankCount === oponentBest.bestRankCount) {
      return myBestCard.bestCard.isGreater(oponentBest.bestCard);
    }

    return myBestCard.bestRankCount > oponentBest.bestRankCount;
  }

  private getBestCard(palette: Card[]): Yellow {
    const map = new Map<Color, Card[]>();

    palette.forEach(card => {
      if (map.get(card.color) === undefined) {
        map.set(card.color, []);
      }

      map.get(card.color)!.push(card);
    });

    let bestCount = -1;
    let bestHighCardInColor: Card | undefined;

    for (const [key, value] of map) {
      const cardsCount = value.length;
      const bestCardInColor = Rules.getBest(value);
      if (cardsCount > bestCount) {
        bestCount = cardsCount;
        bestHighCardInColor = bestCardInColor;
      }
      if (cardsCount === bestCount && bestCardInColor.isGreater(bestHighCardInColor!)) {
        bestCount = cardsCount;
        bestHighCardInColor = bestCardInColor;
      }
    }

    return new Yellow(bestHighCardInColor!, bestCount);
  }
}
