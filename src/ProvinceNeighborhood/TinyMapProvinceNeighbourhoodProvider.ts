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
    additionalShift: number,
  ) {
    const firstIndex = 1;
    const lastIndex = 5;
    for (let i = firstIndex; i < lastIndex; i++) {
      const neighbors: string[] = [];
      if (i - 1 > 0) {
        neighbors.push(heroLetter + (i - 1));
      }
      if (i + 1 < lastIndex) {
        neighbors.push(heroLetter + (i + 1));
      }

      for (const neighborLetter of neighborsLetters) {
        const currentIndex = i + additionalShift;
        if (currentIndex - 1 > 0) {
          neighbors.push(neighborLetter + (currentIndex - 1));
        }
        neighbors.push(neighborLetter + currentIndex);
      }

      const heroProvinceName: string = heroLetter + i;
      neighborhood[heroProvinceName] = neighbors;
    }
  }
}
