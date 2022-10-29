import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { RedRule } from "../src/red7/rules/RedRule";
import { CardFactory } from "./CardFactory";

describe("RedRuleTest", () => {
  it("should return population 4°", () => {
    const myPallete: Card[] = [CardFactory.byRank(2), CardFactory.byRank(6), CardFactory.byRank(2)];

    const oponentPallete: Card[] = [CardFactory.byRank(5)];

    // tslint:disable-next-line: no-unused-expression
    expect(RedRule.isMyPalleteBetter(myPallete, oponentPallete)).to.equal(true);
  });
});
