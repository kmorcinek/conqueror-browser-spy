import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";
import { OrangeRule } from "../src/red7/rules/OrangeRule";
import { CardFactory } from "./CardFactory";

describe("YellowRuleTest", () => {
  const sut = new OrangeRule();

  it("more cards with rank yellow color", () => {
    const myPallete: Card[] = [CardFactory.of(1, Color.Yellow), CardFactory.of(2, Color.Yellow)];

    const oponentPallete: Card[] = [CardFactory.of(3, Color.Yellow), CardFactory.of(5, Color.Red)];

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
