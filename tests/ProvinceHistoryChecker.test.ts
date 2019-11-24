import { expect } from "chai";
import { Province } from "../src/Province";
import { Culture } from "../src/Culture";
import { ProcinceHistoryChecker } from "../src/ProvinceHistoryChecker";
import { ProvinceFactory } from "./ProvinceFactory";

describe("ProcinceHistoryChecker", () => {
  it("for one history entry message is empty", () => {
    const sut = new ProcinceHistoryChecker();
    const province = new ProvinceFactory().build();
    const message = sut.checkHistory([province]);
    // tslint:disable-next-line: no-unused-expression
    expect(message).to.be.null;
  });

  it("suggest developing with 3 population at 11 turn", () => {
    const sut = new ProcinceHistoryChecker();
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
    // tslint:disable-next-line: no-unused-expression
    expect(message).to.equal("poland is developing");
  });

  it("suggest developing with 2 population and 1 resource at 11 turn", () => {
    const sut = new ProcinceHistoryChecker();
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
    // tslint:disable-next-line: no-unused-expression
    expect(message).to.equal("poland is developing");
  });
});
