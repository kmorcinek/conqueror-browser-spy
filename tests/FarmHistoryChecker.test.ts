import { expect } from "chai";
import { Province } from "../src/Province";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { Production } from "../src/Production";
import { FarmHistoryChecker } from "../src/FarmHistoryChecker";
import { ProvinceHistory } from "../src/ProvinceHistory";

describe("FarmHistoryChecker", () => {
  it("should build farm in 4 turn when province has 3 farms/primitive", () => {
    const sut = new FarmHistoryChecker();
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    const history: ProvinceHistory = new ProvinceHistory();
    for (let i = 0; i < 3; i++) {
      provinceFactory.turn = i + 1;
      const province = provinceFactory.build();
      history.add(province);
    }
    const turn = sut.whenNextFarm(history);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(turn).to.equal(5);
  });
});
