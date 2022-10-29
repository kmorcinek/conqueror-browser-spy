import { Card } from "../Card";

export interface Rule {
  isMyPalleteBetter(myPallete: Card[], oponentPallete: Card[]): boolean;
}
