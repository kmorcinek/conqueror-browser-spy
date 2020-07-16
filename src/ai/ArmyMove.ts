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

  // TODO: wrong, cause source.soldiers does not know about already moved soldiers
  get armySize(): number {
    return this.source.soldiers - this.toStay;
  }
}
