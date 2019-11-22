import { Culture } from "../src/Culture";
import { Province } from "../src/Province";

export class ProvinceFactory {
  turn: number = 1;
  name: string = "poland";
  farms: number = 3;
  resources: number = 0;
  culture: Culture = Culture.Primitive;
  production: string = "soldier";
  soldiers: number = 2;
  fort: string = "fort";
  population: string = "3";

  build() {
    return new Province(
      this.turn,
      this.name,
      this.population,
      this.culture,
      this.production,
      this.soldiers,
      this.fort
    );
  }
}
