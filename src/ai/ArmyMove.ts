import { Province } from "../Province";

export class ArmyMove {
  readonly source: Province;
  readonly target: string;
  readonly toStay: number;

  constructor(source: Province, target: string, toStay: number) {
    this.source = source;
    this.target = target;
    this.toStay = toStay;
  }
}
