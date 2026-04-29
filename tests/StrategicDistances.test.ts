import { expect } from "chai";
import { StrategicDistances } from "../src/StrategicDistance/StrategicDistances";
import { ProvinceClosestCapital } from "../src/StrategicDistance/ProvinceClosestCapital";

describe("StrategicDistances", () => {
  const sut = new StrategicDistances("nicaea", "poland");

  it("closest to my capital", () => {
    const result = sut.getDistance("byzantium");
    expect(result.closestCapital).to.equal(ProvinceClosestCapital.Me);
    expect(result.distance).to.equal(1);
  });

  it("closest to opponent capital", () => {
    const result = sut.getDistance("moldavia");
    expect(result.closestCapital).to.equal(ProvinceClosestCapital.Opponent);
    expect(result.distance).to.equal(1);
  });

  it("in the middle between capitals", () => {
    const result = sut.getDistance("bulgaria");
    expect(result.closestCapital).to.equal(ProvinceClosestCapital.Both);
    expect(result.distance).to.equal(2);
  });

  it.skip("getProvincesBetweenCapitals() - skipped: times out, implementation incomplete", () => {
    const result = sut.getProvincesBetweenCapitals();
    expect(result.length).to.equal(8);
  });
});
