import { IPrediction } from "./IPrediction";

export class FarmPrediction implements IPrediction {
  turn: number;

  constructor(turn: number) {
    this.turn = turn;
  }

  getMessage(): string {
    return `Farm in t${this.turn}`;
  }
}
