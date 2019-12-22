import { Culture } from "../src/Culture";
import { Province } from "../src/Province";
import { Production } from "../src/Production";

export class ProvinceFactory {
  turn: number = 1;
  name: string = "poland";
  farms: number = 3;
  resources: number = 0;
  culture: Culture = Culture.Primitive;
  production: Production | null = Production.Soldier;
  soldiers: number = 2;
  fort: string = "fort";

  build() {
    return new Province(
      this.turn,
      this.name,
      this.farms,
      this.resources,
      this.culture,
      this.production,
      this.soldiers,
      this.fort
    );
  }
}
