import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { Production } from "../src/Production";
import { BuildingPattern } from "../src/BuildingPattern";
import { DynamicProductionChecker } from "../src/DynamicProductionChecker";
import { Season } from "../src/Season";

describe("DynamicProductionChecker", () => {
  it("[check] should change to farm in Autumn", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 10;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Advanced;
    provinceFactory.production = Production.Soldier;
    const province = provinceFactory.build();

    const sut = new DynamicProductionChecker();
    const unwantedProduction: BuildingPattern | null = sut.check(province, Season.Autumn);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).changeTo).to.equal(Production.Farm);
  });

  it("[check] should change to soldiers in Spring", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 10;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Advanced;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new DynamicProductionChecker();
    const unwantedProduction: BuildingPattern | null = sut.check(province, Season.Spring);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).changeTo).to.equal(
      Production.Soldier
    );
  });
});
