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
  isMyPaletteBetter(myPalette: Card[], opponentPalette: Card[]) {
    const myBestCard = this.getBestCard(myPalette);
    const opponentBest = this.getBestCard(opponentPalette);

    if (myBestCard.bestRankCount === opponentBest.bestRankCount) {
      return myBestCard.bestCard.isGreater(opponentBest.bestCard);
    }

    return myBestCard.bestRankCount > opponentBest.bestRankCount;
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