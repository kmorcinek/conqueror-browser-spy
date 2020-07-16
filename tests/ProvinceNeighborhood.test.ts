import { expect } from "chai";
import { ProvinceNeighborhood } from "../src/ProvinceNeighborhood";
import { EuropeMapProvinceNeighbourhoodProvider } from "../src/ProvinceNeighborhood/EuropeMapProvinceNeighborhoodProvider";
import { ProvinceMapValidatorMock } from "./ProvinceMapValidatorMock";
import { TinyMapProvinceNeighbourhoodProvider } from "../src/ProvinceNeighborhood/TinyMapProvinceNeighbourhoodProvider";

describe("ProvinceNeighborhood", () => {
  const sut = new ProvinceNeighborhood(
    [new EuropeMapProvinceNeighbourhoodProvider()],
    new ProvinceMapValidatorMock([])
  );

  it("should have distance 0 to itself", () => {
    const distance = sut.getDistance("natolia", "natolia");
    expect(distance).to.equal(0);
  });

  it("should have distance 1 to neighbor", () => {
    const distance = sut.getDistance("natolia", "nicaea");
    expect(distance).to.equal(1);
  });

  it("should have distance 2", () => {
    const distance = sut.getDistance("natolia", "byzantium");
    expect(distance).to.equal(2);
  });

  it("should have distance 4", () => {
    const distance = sut.getDistance("palestine", "byzantium");
    expect(distance).to.equal(4);
  });

  it("should have path with only neighbor to neighbor", () => {
    const path = sut.getPath("natolia", "nicaea");
    expect(path.length).to.equal(1);
    expect(path[0]).to.equal("nicaea");
  });

  it("should have path with 2 provinces from natolia to byzantium", () => {
    const path = sut.getPath("natolia", "byzantium");
    expect(path.length).to.equal(2);
    expect(path[0]).to.equal("nicaea");
    expect(path[1]).to.equal("byzantium");
  });

  it("should ignore a1 when generating tiny map", () => {
    const tinyMapNeighborhood = new ProvinceNeighborhood(
      [new TinyMapProvinceNeighbourhoodProvider()],
      new ProvinceMapValidatorMock(["a1"])
    );

    const a1Province = tinyMapNeighborhood.getNeighbors("a1");
    expect(a1Province.length).to.equal(0);

    const neighbors = tinyMapNeighborhood.getNeighbors("b2");
    expect(neighbors.length).to.equal(5);
    expect(neighbors.includes("a2")).to.equal(true);
    expect(neighbors.includes("b1")).to.equal(true);
    expect(neighbors.includes("b3")).to.equal(true);
    expect(neighbors.includes("c1")).to.equal(true);
    expect(neighbors.includes("c2")).to.equal(true);
  });

  it("should have 2 different path from natolia to palestine", () => {
    const manyPath = sut.getManyPathWithDistance2("natolia", "palestine");
    expect(manyPath.length).to.equal(2);
    expect(manyPath[0][0]).to.equal("syria");
    expect(manyPath[0][1]).to.equal("palestine");
    expect(manyPath[1][0]).to.equal("cyprus");
    expect(manyPath[1][1]).to.equal("palestine");
  });
});
