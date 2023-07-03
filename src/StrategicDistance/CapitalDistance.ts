import { ProvinceClosestCapital } from "./ProvinceClosestCapital";

export class CapitalDistance {
  readonly closestCapital: ProvinceClosestCapital;
  readonly distance: number;

  constructor(closestCapital: ProvinceClosestCapital, distance: number) {
    this.closestCapital = closestCapital;
    this.distance = distance;
  }
}
