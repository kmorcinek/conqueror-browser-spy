import { expect } from "chai";
import { Province } from "../src/Province";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { ProvinceHistory } from "../src/ProvinceHistory";

describe("ProvinceHistory", () => {
  it("should [findHistoryAfterBuildingFinished] find first province when nothing was built", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    const sut: ProvinceHistory = new ProvinceHistory();
    for (let i = 0; i < 3; i++) {
      provinceFactory.turn = i + 1;
      const province = provinceFactory.build();
      sut.add(province);
    }
    const provinceFound = sut.findHistoryAfterBuildingFinished();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(provinceFound.turn).to.equal(1);
  });

  it("should [findHistoryAfterBuildingFinished] find province after farms was built", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    const sut: ProvinceHistory = new ProvinceHistory();

    provinceFactory.turn = 1;
    sut.add(provinceFactory.build());
    provinceFactory.turn += 1;
    provinceFactory.farms += 1;
    sut.add(provinceFactory.build());

    const provinceFound = sut.findHistoryAfterBuildingFinished();
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(provinceFound.turn).to.equal(2);
  });

  it("should [wasSomethingBuilt] return false when soldier was killed", () => {
    const provinceFactory = new ProvinceFactory();

    provinceFactory.turn = 1;
    provinceFactory.soldiers = 2;
    const previousProvince = provinceFactory.build();
    provinceFactory.turn += 1;
    provinceFactory.soldiers -= 1;
    const provinceWithKilledSoldiers = provinceFactory.build();

    const result = ProvinceHistory.wasSomethingBuilt(provinceWithKilledSoldiers, previousProvince);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.false;
  });

  it("should [wasSomethingBuilt] return false when soldier was unchanged", () => {
    const provinceFactory = new ProvinceFactory();

    provinceFactory.turn = 1;
    provinceFactory.soldiers = 2;
    const previousProvince = provinceFactory.build();
    provinceFactory.turn += 1;
    const provinceWithBuildSoldiers = provinceFactory.build();

    const result = ProvinceHistory.wasSomethingBuilt(provinceWithBuildSoldiers, previousProvince);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.false;
  });

  it("should [wasSomethingBuilt] return true when soldier was built", () => {
    const provinceFactory = new ProvinceFactory();

    provinceFactory.turn = 1;
    provinceFactory.soldiers = 2;
    const previousProvince = provinceFactory.build();
    provinceFactory.turn += 1;
    provinceFactory.soldiers += 2;
    const provinceWithBuildSoldiers = provinceFactory.build();

    const result = ProvinceHistory.wasSomethingBuilt(provinceWithBuildSoldiers, previousProvince);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(result).to.be.true;
  });
});
