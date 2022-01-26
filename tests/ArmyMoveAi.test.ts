import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { ArmyMoverAi } from "../src/ai/ArmyMoverAi";
import { ProvinceHistoryService } from "../src/ProvinceHistoryService";
import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceOwner } from "../src/ProvinceOwner";

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
      null as any,
      null as any
    );

    const neighbors = [
      new BattleProvince(primitiveProvince, ProvinceOwner.Opponent),
      new BattleProvince(developedProvince, ProvinceOwner.Opponent),
    ];

    const sortedProvinces: BattleProvince[] = sut.sortByProvinceValue(neighbors);
    expect(sortedProvinces[0].name).to.equal(developedProvince.name);
    expect(sortedProvinces[1].name).to.equal(primitiveProvince.name);
  });
});
