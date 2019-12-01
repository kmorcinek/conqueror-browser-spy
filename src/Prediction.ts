import { Production } from "./Production";
import { IPrediction } from "./IPrediction";

export class Prediction implements IPrediction {
  production: Production;

  constructor(production: Production) {
    this.production = production;
  }

  getMessage(): string {
    return this.production.toString();
  }
}
