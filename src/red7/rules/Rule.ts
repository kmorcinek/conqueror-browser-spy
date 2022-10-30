import { Card } from "../Card";

export interface Rule {
  isMyPaletteBetter(myPalette: Card[], oponentPalette: Card[]): boolean;
}
