import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { OrangeRule } from "../src/red7/rules/OrangeRule";
import { CardFactory } from "./CardFactory";

describe("OrangeRuleTest", () => {
  const sut = new OrangeRule();
  it("more cards with rank 1", () => {
    const myPalette: Card[] = [CardFactory.byRank(1), CardFactory.byRank(1), CardFactory.byRank(1)];

    const opponentPalette: Card[] = [CardFactory.byRank(5), CardFactory.byRank(5)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, opponentPalette)).to.equal(true);
  });

  it("higher color", () => {
    const myPalette: Card[] = [CardFactory.of(7, Color.Red)];

    const opponentPalette: Card[] = [CardFactory.of(7, Color.Orange)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, opponentPalette)).to.equal(true);
  });
});
