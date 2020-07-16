import { BattleProvince } from "./BattleProvince";

export class ArmyMove {
  readonly source: BattleProvince;
  readonly target: BattleProvince;
  readonly toStay: number;

  constructor(source: BattleProvince, target: BattleProvince, toStay: number) {
    this.source = source;
    this.target = target;
    this.toStay = toStay;
  }

  get armySize(): number {
    return this.source.remainingSoldiers - this.toStay;
  }
}
