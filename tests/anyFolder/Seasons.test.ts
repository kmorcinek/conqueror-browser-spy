import { expect } from "chai";
import { Season } from "../../src/Season";
import { Seasons } from "../../src/Seasons";

describe("SeasonsTest", () => {
  it("should parse Spring", () => {
    expect(Seasons.parseSeason(1)).to.equal(Season.Spring);
    expect(Seasons.parseSeason(5)).to.equal(Season.Spring);
    expect(Seasons.parseSeason(9)).to.equal(Season.Spring);
  });

  it("should parse Autumn", () => {
    expect(Seasons.parseSeason(3)).to.equal(Season.Autumn);
    expect(Seasons.parseSeason(7)).to.equal(Season.Autumn);
    expect(Seasons.parseSeason(11)).to.equal(Season.Autumn);
  });
});
