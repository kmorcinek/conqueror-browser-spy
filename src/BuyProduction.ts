import { Production } from "./Production";

export class BuyProduction {
  static of(production: Production) {
    return new BuyProduction(production);
  }

  readonly production: Production;

  constructor(production: Production) {
    this.production = production;
  }
}
