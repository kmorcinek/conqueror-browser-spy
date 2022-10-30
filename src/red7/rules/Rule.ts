import { Card } from "../Card";

export interface Rule {
  isMyPaletteBetter(myPalette: Card[], opponentPalette: Card[]): boolean;
}
