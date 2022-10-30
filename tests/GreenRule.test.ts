import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { GreenRule } from "../src/red7/rules/GreenRule";
import { CardFactory } from "./CardFactory";

describe("GreenRuleTest", () => {
  const sut = new GreenRule();

  it("one even card", () => {
    const myPalette: Card[] = [CardFactory.byRank(1), CardFactory.byRank(2)];

    const oponentPalette: Card[] = [CardFactory.byRank(7), CardFactory.byRank(5)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });

  it("more even cards", () => {
    const myPalette: Card[] = [CardFactory.byRank(4), CardFactory.byRank(2)];

    const oponentPalette: Card[] = [CardFactory.byRank(6)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });

  it("higher color", () => {
    const myPalette: Card[] = [CardFactory.of(4, Color.Red)];

    const oponentPalette: Card[] = [CardFactory.of(4, Color.Yellow)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });
});
