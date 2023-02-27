import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { Production } from "../src/Production";
import { BuildingPattern } from "../src/BuildingPattern";
import { StaticProductionChecker } from "../src/StaticProductionChecker";

describe("StaticProductionChecker", () => {
  it("[check] should work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new StaticProductionChecker();
    const unwantedProduction: BuildingPattern | null = sut.check(province);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).changeTo).to.equal(
      Production.Culture,
    );
  });

  it("[check] should not force change for 3f+1 and developing", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 1;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Culture;
    const province = provinceFactory.build();

    const sut = new StaticProductionChecker();
    const unwantedProduction: BuildingPattern | null = sut.check(province);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(unwantedProduction).to.equal(null);
  });
});
