import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { ProductionChecker } from "../src/ProductionChecker";
import { Production } from "../src/Production";
import { BuildingPattern } from "../src/BuildingPattern";

describe("ProductionChecker", () => {
  it("should [checkBuildingProvinces] work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new ProductionChecker(null as any, null as any, null as any, null as any);
    const unwantedProduction: BuildingPattern | null = sut.checkBuildingProvince(province);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).changeTo).to.equal(
      Production.Culture
    );
  });

  it("should [checkBuildingProvinces] change to gold at 60k+0", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 6;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Advanced;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new ProductionChecker(null as any, null as any, null as any, null as any);
    const unwantedProduction: BuildingPattern | null = sut.checkBuildingProvince(province);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).changeTo).to.equal(Production.Gold);
  });
});

describe("ProductionChecker", () => {
  it("should [checkBuildingProvinces] not force change for 3f+1 and developing", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 1;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Culture;
    const province = provinceFactory.build();

    const sut = new ProductionChecker(null as any, null as any, null as any, null as any);
    const unwantedProduction: BuildingPattern | null = sut.checkBuildingProvince(province);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.equal(null);
  });
});
