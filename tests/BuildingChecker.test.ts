import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { BuildingChecker } from "../src/BuildingChecker";
import { Production } from "../src/Production";

describe("BuildingChecker", () => {
  it("should [checkBuildingProvinces] work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.production = Production.Farm;
    const province = provinceFactory.build();

    const sut = new BuildingChecker(null as any, null as any);
    const unwantedProduction = sut.checkBuildingProvince(province);
    // tslint:disable-next-line: no-unused-expression
    expect(unwantedProduction).to.equal(Production.Farm);
  });
});
