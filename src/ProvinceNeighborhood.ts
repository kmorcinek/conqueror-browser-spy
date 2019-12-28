import { Provinces } from "./Provinces";

export class ProvinceNeighborhood {
  neighbors: Record<string, string[]> = {};
  cachedDistances: Record<string, number> = {};
  cachedPath: Record<string, string[]> = {};

  constructor() {
    this.assignEuropeProvinces();
    this.assignRandomProvinces();
  }

  getNeighbors(provinceName: string) {
    const neighbors = this.neighbors[provinceName];
    if (neighbors === undefined) {
      return [];
    }

    return neighbors;
  }

  getPath(source: string, target: string): string[] {
    const key = this.concatWay(source, target);
    const cachedPath = this.cachedPath[key];
    if (cachedPath !== undefined) {
      return cachedPath;
    }

    const path = this.getPathNotCached(source, target);
    this.cachedPath[key] = path;
    return path;
  }

  getPathNotCached(source: string, target: string): string[] {
    if (source === target) {
      return [];
    }

    const visited: string[] = [source];
    const path = this.getDistanceInternal(visited, target).path;
    path.shift();
    return path;
  }

  getDistance(source: string, target: string): number {
    const key = this.concatWay(source, target);
    const cachedDistance = this.cachedDistances[key];
    if (cachedDistance !== undefined) {
      return cachedDistance;
    }

    const distance = this.getDistanceNotCached(source, target);
    this.cachedDistances[key] = distance;
    return distance;
  }

  private concatWay(source: string, target: string) {
    return source + ";" + target;
  }

  private getDistanceNotCached(source: string, target: string): number {
    if (source === target) {
      return 0;
    }

    const visited: string[] = [source];
    return this.getDistanceInternal(visited, target).distance - 1;
  }

  private getDistanceInternal(visited: string[], target: string): DistanceAndPath {
    const source: string = visited[visited.length - 1];
    if (source === target) {
      return DistanceAndPath.create(visited);
    }

    const neighbors = this.getNeighbors(source);
    let bestPath: DistanceAndPath = DistanceAndPath.Empty;
    const notVisitedNeighbors = neighbors.filter(neighbor => visited.includes(neighbor) === false);
    for (const neighbor of notVisitedNeighbors) {
      const newVisited = Object.assign([], visited);
      newVisited.push(neighbor);
      const distanceAndPath = this.getDistanceInternal(newVisited, target);
      bestPath = DistanceAndPath.min(bestPath, distanceAndPath);
    }

    return bestPath;
  }

  private assignRandomProvinces() {
    // This setting is for Tiny Team Arena map
    this.foo("a", ["b"]);
    this.foo("b", ["a", "c"]);
    this.foo("c", ["b", "d"]);
    this.foo("d", ["c", "e"]);
    this.foo("e", ["d"]);
  }

  private foo(heroLetter: string, neighborsLetters: string[]) {
    const firstIndex = 1;
    const lastIndex = 5;
    for (let i = firstIndex; i < lastIndex; i++) {
      const heroProvinceName = heroLetter + i;
      const neighbors: string[] = [];
      if (i - 1 > 0) {
        neighbors.push(heroLetter + (i - 1));
      }
      if (i + 1 < lastIndex) {
        neighbors.push(heroLetter + (i + 1));
      }

      for (const neighborLetter of neighborsLetters) {
        if (i - 1 > 0) {
          neighbors.push(neighborLetter + (i - 1));
        }
        neighbors.push(neighborLetter + i);
      }

      this.neighbors[heroProvinceName] = neighbors;
    }
  }

  private assignEuropeProvinces() {
    this.neighbors.natolia = ["nicaea", "syria", "cyprus"];
    this.neighbors.nicaea = ["natolia", "byzantium", "greece", "crete"];
    this.neighbors.crete = ["greece", "nicaea"];
    this.neighbors.greece = ["macedonia", "nicaea", "crete"];
    this.neighbors.byzantium = ["macedonia", "nicaea", "bulgaria"];
    this.neighbors.macedonia = ["bulgaria", "byzantium", "greece", "napoli", "dalmatia", "serbia"];
    this.neighbors.dalmatia = ["macedonia", "venetia", "austria", "hungary", "serbia"];
    this.neighbors.serbia = [
      "dalmatia",
      "macedonia",
      "hungary",
      "bulgaria",
      "wallachia",
      "transylvania",
    ];
    this.neighbors.wallachia = ["serbia", "moldavia", "bulgaria", "transylvania"];
    this.neighbors.transylvania = ["hungary", "poland", "moldavia", "wallachia", "serbia"];
    this.neighbors.moldavia = [
      "poland",
      "podolia",
      "ukraine",
      "crimea",
      "bulgaria",
      "wallachia",
      "transylvania",
    ];
    this.neighbors.syria = ["natolia", "palestine", "cyprus"];
    this.neighbors.cyprus = ["natolia", "palestine", "syria"];
    this.neighbors.palestine = ["egypt", "cyprus", "syria"];
    this.neighbors.egypt = ["cyrenaica", "palestine"];
    this.neighbors.cyrenaica = ["egypt", "tripoli"];
    this.neighbors.tripoli = ["cyrenaica", "tunis"];
    this.neighbors.tunis = ["sardinia", "sicilia", "tripoli", "algiers"];
    this.neighbors.algiers = ["tangiers", "tunis"];
    this.neighbors.tangiers = ["grenada", "morocco", "algiers"];
    this.neighbors.morocco = ["tangiers"];
    this.neighbors.sardinia = ["tunis", "corsica"];
    this.neighbors.corsica = ["sardinia", "provence", "genoa", "roma"];
    this.neighbors.genoa = ["provence", "burgundy", "helvetica", "venetia", "roma", "corsica"];
    this.neighbors.provence = ["aquitaine", "iledefrance", "burgundy", "genoa", "corsica"];
    this.neighbors.sicilia = ["napoli", "tunis"];
    this.neighbors.napoli = ["sicilia", "macedonia", "roma"];
    this.neighbors.roma = ["corsica", "genoa", "napoli", "venetia"];
    this.neighbors.venetia = ["genoa", "helvetica", "austria", "dalmatia", "roma"];

    const validProvinces = Provinces.getProvinces();
    for (const key of Object.keys(this.neighbors)) {
      const neighbors = this.neighbors[key];
      const toCheck = Object.assign([], neighbors);
      toCheck.push(key);
      for (const province of toCheck) {
        if (validProvinces.includes(province) === false) {
          const message = `Wrong neighbor province name '${province}'`;
          console.error(message);
          throw new Error(message);
        }
      }
    }
  }
}

class DistanceAndPath {
  static Empty = new DistanceAndPath(300, []);

  static min(first: DistanceAndPath, second: DistanceAndPath) {
    return first.distance < second.distance ? first : second;
  }

  static create(path: string[]) {
    return new DistanceAndPath(path.length, path);
  }

  distance: number;
  path: string[];

  private constructor(distance: number, path: string[]) {
    this.distance = distance;
    this.path = path;
  }
}
