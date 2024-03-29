import { expect } from "chai";
import { Province } from "../src/Province";
import { Culture } from "../src/Culture";
import { ProvinceHistoryChecker } from "../src/ProvinceHistoryChecker";
import { ProvinceFactory } from "./ProvinceFactory";
import { Production } from "../src/Production";

describe("ProvinceHistoryChecker", () => {
  it("for one history entry message is empty", () => {
    const sut = new ProvinceHistoryChecker();
    const province = new ProvinceFactory().build();
    const message = sut.checkHistory([province]);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(message).to.be.null;
  });

  it("suggest developing with 3 population at 11 turn", () => {
    const sut = new ProvinceHistoryChecker();
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 3;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    const province = provinceFactory.build();
    const history: Province[] = [];
    for (let i = 0; i < 7; i++) {
      history.push(province);
    }
    const message = sut.checkHistory(history);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(message).to.equal(Production.Culture);
  });

  it("suggest developing with 2 population and 1 resource at 11 turn", () => {
    const sut = new ProvinceHistoryChecker();
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 2;
    provinceFactory.resources = 1;
    provinceFactory.culture = Culture.Primitive;
    const province = provinceFactory.build();
    const history: Province[] = [];
    for (let i = 0; i < 7; i++) {
      history.push(province);
    }
    const message = sut.checkHistory(history);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(message).to.equal(Production.Culture);
  });

  it("Should predict Culture with 4 farms at turn 5", () => {
    const sut = new ProvinceHistoryChecker();
    const provinceFactory = new ProvinceFactory();
    provinceFactory.farms = 4;
    provinceFactory.resources = 0;
    provinceFactory.culture = Culture.Primitive;
    const province = provinceFactory.build();
    const history: Province[] = [];
    for (let i = 0; i < 5; i++) {
      history.push(province);
    }
    const message = sut.checkHistory(history);
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    expect(message).to.equal(Production.Culture);
  });
});
