import { expect } from "chai";
import { ProvinceFactory } from "./ProvinceFactory";

describe("ProvinceTest", () => {
  it("should return population 4°", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 1;
    const province = provinceFactory.build();
    // tslint:disable-next-line: no-unused-expression
    expect(province.getPopulation()).to.equal("4°");
  });

  it("should return population 3°°", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 2;
    const province = provinceFactory.build();
    // tslint:disable-next-line: no-unused-expression
    expect(province.getPopulation()).to.equal("3°°");
  });
});
