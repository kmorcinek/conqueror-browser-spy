import { expect } from "chai";
import { Card } from "../src/red7/Card";
import { Color } from "../src/red7/Color";

describe("Card", () => {
  it("backgroundPosition", () => {
    const mockElement = {
      style: {
        backgroundPosition: "-300% -500%",
      },
    };
    const card = Card.parseCard(mockElement as any);

    // tslint:disable-next-line: no-unused-expression
    expect(card.color).to.equal(Color.Indigo);
    expect(card.rank).to.equal(4);
  });

  it("toString", () => {
    const card = new Card(7, Color.Red, "");

    const str = card.toString();
    // tslint:disable-next-line: no-unused-expression
    expect(str).to.equal("'Red:7'");
  });
});
