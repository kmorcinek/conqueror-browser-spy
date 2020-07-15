import { IProvinceNeighbourhoodProvider } from "./IProvinceNeighbourhoodProvider";

export class TinyMapProvinceNeighbourhoodProvider implements IProvinceNeighbourhoodProvider {
  getNeighborhood(): Record<string, string[]> {
    const neighborhood: Record<string, string[]> = {};

    // This setting is for Tiny Team Arena map
    this.assign(neighborhood, "a", ["b"], 1);
    this.assign(neighborhood, "b", ["a", "c"], 0);
    this.assign(neighborhood, "c", ["b", "d"], 1);
    this.assign(neighborhood, "d", ["c", "e"], 0);
    this.assign(neighborhood, "e", ["d"], 1);

    return neighborhood;
  }

  private assign(
    neighborhood: Record<string, string[]>,
    heroLetter: string,
    neighborsLetters: string[],
    addinionalShift: number
  ) {
    const firstIndex = 1;
    const lastIndex = 5;
    for (let i = firstIndex; i < lastIndex; i++) {
      const neighbors: string[] = [];
      if (i - 1 > 0) {
        this.push(neighbors, heroLetter + (i - 1));
      }
      if (i + 1 < lastIndex) {
        this.push(neighbors, heroLetter + (i + 1));
      }

      for (const neighborLetter of neighborsLetters) {
        const currentIndex = i + addinionalShift;
        if (currentIndex - 1 > 0) {
          this.push(neighbors, neighborLetter + (currentIndex - 1));
        }
        this.push(neighbors, neighborLetter + currentIndex);
      }

      const heroProvinceName: string = heroLetter + i;
      neighborhood[heroProvinceName] = neighbors;
    }
  }

  private push(neighbors: string[], neighbor: string) {
    const notExistingProvinces = ["a1", "a4", "e4", "b5", "d5"];
    if (notExistingProvinces.includes(neighbor)) {
      return;
    }

    neighbors.push(neighbor);
  }
}
