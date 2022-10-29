import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { OrangeRule } from "../src/red7/rules/OrangeRule";
import { CardFactory } from "./CardFactory";

describe("OrangeRuleTest", () => {
  const sut = new OrangeRule();
  it("more cards with rank 1", () => {
    const myPallete: Card[] = [CardFactory.byRank(1), CardFactory.byRank(1), CardFactory.byRank(1)];

    const oponentPallete: Card[] = [CardFactory.byRank(5), CardFactory.byRank(5)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPalleteBetter(myPallete, oponentPallete)).to.equal(true);
  });

  it("higher color", () => {
    const myPallete: Card[] = [CardFactory.of(7, Color.Red)];

    const oponentPallete: Card[] = [CardFactory.of(7, Color.Orange)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPalleteBetter(myPallete, oponentPallete)).to.equal(true);
  });
});
