import { expect } from "chai";
import { Province } from "../src/Province";
import { Culture } from "../src/Culture";
import { ProcinceHistoryChecker } from "../src/ProvinceHistoryChecker";

describe("ProcinceHistoryChecker", () => {
  it("for one history entry message is empty", () => {
    const sut = new ProcinceHistoryChecker();
    const province = new Province(1, "poland", "2", Culture.Primitive, "soldier", 1, "");
    const message = sut.checkHistory([province]);
    // tslint:disable-next-line: no-unused-expression
    expect(message).to.be.null;
  });

  // it("suggest developing with 3 population at 11 turn", () => {
  //   const sut = new ProcinceHistoryChecker();
  //   const province = new Province(1, "poland", "2", Culture.Primitive, "soldier", 1, "");
  //   const message = sut.checkHistory([province]);
  //   // tslint:disable-next-line: no-unused-expression
  //   expect(message).to.be.null;
  // });
});
