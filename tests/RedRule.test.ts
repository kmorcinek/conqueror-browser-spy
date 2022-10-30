import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { RedRule } from "../src/red7/rules/RedRule";
import { CardFactory } from "./CardFactory";

describe("RedRuleTest", () => {
  const sut = new RedRule();

  it("higher", () => {
    const myPalette: Card[] = [CardFactory.byRank(2), CardFactory.byRank(6), CardFactory.byRank(2)];

    const oponentPalette: Card[] = [CardFactory.byRank(5)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });

  it("higher color", () => {
    const myPalette: Card[] = [CardFactory.of(4, Color.Red)];

    const oponentPalette: Card[] = [CardFactory.of(4, Color.Orange)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });
});
