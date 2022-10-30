import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { YellowRule } from "../src/red7/rules/YellowRule";
import { CardFactory } from "./CardFactory";

describe("YellowRuleTest", () => {
  const sut = new YellowRule();

  it("more cards with rank yellow color", () => {
    const myPalette: Card[] = [CardFactory.of(1, Color.Yellow), CardFactory.of(2, Color.Yellow)];

    const oponentPalette: Card[] = [CardFactory.of(3, Color.Yellow), CardFactory.of(5, Color.Red)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });

  it("higher color", () => {
    const myPalette: Card[] = [CardFactory.of(7, Color.Red)];

    const oponentPalette: Card[] = [CardFactory.of(7, Color.Orange)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });

  it("when two colors have the same count, then the highest card wins", () => {
    const myPalette: Card[] = [CardFactory.of(1, Color.Red), CardFactory.of(7, Color.Yellow)];

    const oponentPalette: Card[] = [CardFactory.of(5, Color.Orange), CardFactory.of(5, Color.Red)];

    // tslint:disable-next-line: no-unused-expression
    expect(sut.isMyPaletteBetter(myPalette, oponentPalette)).to.equal(true);
  });
});
