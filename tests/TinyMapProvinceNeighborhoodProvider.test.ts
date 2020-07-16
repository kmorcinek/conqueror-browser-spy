import { expect } from "chai";
import { TinyMapProvinceNeighbourhoodProvider } from "../src/ProvinceNeighborhood/TinyMapProvinceNeighbourhoodProvider";

describe("TinyProvinceNeighborhoodsProvider", () => {
  it("tiny map around b2", () => {
    const sut = new TinyMapProvinceNeighbourhoodProvider();
    const neighbors = sut.getNeighborhood().b2;
    expect(neighbors.length).to.equal(6);
    expect(neighbors.includes("a1")).to.equal(true);
    expect(neighbors.includes("a2")).to.equal(true);
    expect(neighbors.includes("b1")).to.equal(true);
    expect(neighbors.includes("b3")).to.equal(true);
    expect(neighbors.includes("c1")).to.equal(true);
    expect(neighbors.includes("c2")).to.equal(true);
  });

  it("tiny map around c2", () => {
    const sut = new TinyMapProvinceNeighbourhoodProvider();
    const neighbors = sut.getNeighborhood().c2;
    expect(neighbors.length).to.equal(6);
    expect(neighbors.includes("b2")).to.equal(true);
    expect(neighbors.includes("b3")).to.equal(true);
    expect(neighbors.includes("c1")).to.equal(true);
    expect(neighbors.includes("c3")).to.equal(true);
    expect(neighbors.includes("d2")).to.equal(true);
    expect(neighbors.includes("d3")).to.equal(true);
  });
});
