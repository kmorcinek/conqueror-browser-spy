import { ProvinceNeighborhood } from "./ProvinceNeighborhood";
import { IProvinceOwnership } from "./IProvinceOwnership";

export class ProvinceNeighborhoods {
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;

  constructor(provinceOwnership: IProvinceOwnership, provinceNeighborhood: ProvinceNeighborhood) {
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
  }

  getCloseNotCounqueredNeighbors(source: string) {
    const neighbors = this.getNotCounqueredNeighbors();

    let smallestDistance: number = 300;
    for (const neighbor of neighbors) {
      const distance = this.provinceNeighborhood.getDistance(source, neighbor);
      smallestDistance = Math.min(distance, smallestDistance);
    }

    return neighbors.filter(
      province => this.provinceNeighborhood.getDistance(source, province) === smallestDistance
    );
  }

  getNotCounqueredNeighbors() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    const allNeighbors = new Set<string>();
    for (const ownedProvince of ownedProvinces) {
      const neighbors = this.provinceNeighborhood.getNeighbors(ownedProvince);
      for (const neighbor of neighbors) {
        allNeighbors.add(neighbor);
      }
    }

    const neighborNotOwned = [];
    for (const maybeNeighbor of allNeighbors) {
      if (ownedProvinces.includes(maybeNeighbor) === false) {
        neighborNotOwned.push(maybeNeighbor);
      }
    }

    return neighborNotOwned;
  }
}