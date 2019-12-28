import { expect } from "chai";
import { ProvinceNeighborhoods } from "../src/ProvinceNeighborhoods";
import { ProvinceNeighborhood } from "../src/ProvinceNeighborhood";
import { IProvinceOwnership } from "../src/IProvinceOwnership";

describe("ProvinceNeighborhoods", () => {
  it("should have neutral neighbors around natolia", () => {
    const provinceOwnershipMock: IProvinceOwnership = {
      // tslint:disable-next-line: no-empty
      updateOwnedProvinces: () => {},
      getConqueredProvinces: () => [],
      getOwnedProvinces: () => ["natolia"],
      getNotOwned: (provinces: string[]) => provinces,
      filterOpponents: (provinces: string[]) => provinces,
      filterNeutral: (provinces: string[]) => provinces,
      // tslint:disable-next-line: no-empty
      reset: () => {},
    };
    const sut = new ProvinceNeighborhoods(provinceOwnershipMock, new ProvinceNeighborhood());
    const neutralNeighbors = sut.getNotConqueredNeighbors();
    expect(neutralNeighbors.length).to.equal(3);
    expect(neutralNeighbors.includes("nicaea")).to.equal(true);
    expect(neutralNeighbors.includes("syria")).to.equal(true);
    expect(neutralNeighbors.includes("cyprus")).to.equal(true);
  });

  it("should have neutral neighbors around natolia, cyprus and syria", () => {
    const provinceOwnershipMock: IProvinceOwnership = {
      // tslint:disable-next-line: no-empty
      updateOwnedProvinces: () => {},
      getConqueredProvinces: () => [],
      getOwnedProvinces: () => ["natolia", "cyprus", "syria"],
      getNotOwned: (provinces: string[]) => provinces,
      filterOpponents: (provinces: string[]) => provinces,
      filterNeutral: (provinces: string[]) => provinces,
      // tslint:disable-next-line: no-empty
      reset: () => {},
    };
    const sut = new ProvinceNeighborhoods(provinceOwnershipMock, new ProvinceNeighborhood());
    const neutralNeighbors = sut.getNotConqueredNeighbors();
    expect(neutralNeighbors.length).to.equal(2);
    expect(neutralNeighbors.includes("nicaea")).to.equal(true);
    expect(neutralNeighbors.includes("palestine")).to.equal(true);
  });

  it("should have closest neutral neighbor from syria to egypt", () => {
    const provinceOwnershipMock: IProvinceOwnership = {
      // tslint:disable-next-line: no-empty
      updateOwnedProvinces: () => {},
      getConqueredProvinces: () => [],
      getOwnedProvinces: () => ["natolia", "cyprus", "syria", "palestine", "nicaea"],
      getNotOwned: (provinces: string[]) => provinces,
      filterOpponents: (provinces: string[]) => provinces,
      filterNeutral: (provinces: string[]) => provinces,
      // tslint:disable-next-line: no-empty
      reset: () => {},
    };
    const sut = new ProvinceNeighborhoods(provinceOwnershipMock, new ProvinceNeighborhood());
    const neutralNeighbors = sut.getCloseNotConqueredNeighbors("syria");
    expect(neutralNeighbors.length).to.equal(1);
    expect(neutralNeighbors[0]).to.equal("egypt");
  });
});
