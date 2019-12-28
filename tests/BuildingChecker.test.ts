import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { BuildingChecker } from "../src/BuildingChecker";
import { Production } from "../src/Production";
import { BuildingPattern } from "../src/BuildingPattern";

describe("BuildingChecker", () => {
  it("should [checkBuildingProvinces] work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new BuildingChecker(null as any, null as any, null as any, null as any);
    const unwantedProduction: BuildingPattern | null = sut.checkBuildingProvince(province);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.not.equal(null);
    expect(((unwantedProduction as unknown) as BuildingPattern).production).to.equal(
      Production.Farm
    );
  });
});
