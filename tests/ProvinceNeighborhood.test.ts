import { expect } from "chai";
import { ProvinceNeighborhood } from "../src/ProvinceNeighborhood";

describe("ProvinceNeighborhood", () => {
  it("should have distance 0 to itself", () => {
    const sut = new ProvinceNeighborhood([]);
    const distance = sut.getDistance("natolia", "natolia");
    expect(distance).to.equal(0);
  });

  it("should have distance 1 to neighbor", () => {
    const sut = new ProvinceNeighborhood([]);
    const distance = sut.getDistance("natolia", "nicaea");
    expect(distance).to.equal(1);
  });

  it("should have distance 2", () => {
    const sut = new ProvinceNeighborhood([]);
    const distance = sut.getDistance("natolia", "byzantium");
    expect(distance).to.equal(2);
  });

  it("should have distance 4", () => {
    const sut = new ProvinceNeighborhood([]);
    const distance = sut.getDistance("palestine", "byzantium");
    expect(distance).to.equal(4);
  });

  it("should have path with only neighbor to neighbor", () => {
    const sut = new ProvinceNeighborhood([]);
    const path = sut.getPath("natolia", "nicaea");
    expect(path.length).to.equal(1);
    expect(path[0]).to.equal("nicaea");
  });

  it("should have path with 2 provinces from natolia to byzantium", () => {
    const sut = new ProvinceNeighborhood([]);
    const path = sut.getPath("natolia", "byzantium");
    expect(path.length).to.equal(2);
    expect(path[0]).to.equal("nicaea");
    expect(path[1]).to.equal("byzantium");
  });
});
