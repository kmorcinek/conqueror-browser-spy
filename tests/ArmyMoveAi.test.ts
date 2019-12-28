import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { ArmyMoverAi } from "../src/ai/ArmyMoverAi";
import { ProvinceHistoryService } from "../src/ProvinceHistoryService";

describe("ArmyMoveAi", () => {
  it("should [sortByProvinceValue] work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.name = "natolia";
    const primitiveProvince = provinceFactory.build();
    provinceFactory.culture = Culture.Developed;
    provinceFactory.name = "syria";
    const developedProvince = provinceFactory.build();

    expect(primitiveProvince.calculateValue() < developedProvince.calculateValue()).to.equal(true);

    const provinceHistoryService = new ProvinceHistoryService();
    provinceHistoryService.getByName(primitiveProvince.name).add(primitiveProvince);
    provinceHistoryService.getByName(developedProvince.name).add(developedProvince);
    const sut = new ArmyMoverAi(
      null as any,
      null as any,
      null as any,
      null as any,
      provinceHistoryService
    );

    const neighbors = [primitiveProvince.name, developedProvince.name];
    const sortedProvinces: string[] = sut.sortByProvinceValue(neighbors);
    expect(sortedProvinces[0]).to.equal(developedProvince.name);
    expect(sortedProvinces[1]).to.equal(primitiveProvince.name);
  });
});
