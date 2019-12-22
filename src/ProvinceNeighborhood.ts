import { Provinces } from "./Provinces";

export class ProvinceNeighborhood {
  neighbors: Record<string, string[]> = {};

  constructor() {
    this.neighbors.natolia = ["nicaea", "syria", "cyprus"];
    this.neighbors.nicaea = ["natolia", "byzantium", "greece", "crete"];
    this.neighbors.crete = ["greece", "nicaea"];
    this.neighbors.greece = ["macedonia", "nicaea", "crete"];
    this.neighbors.byzantium = ["macedonia", "nicaea", "bulgaria"];
    this.neighbors.macedonia = ["bulgaria", "byzantium", "greece", "napoli", "dalmatia", "serbia"];
    this.neighbors.syria = ["natolia", "palestine", "cyprus"];
    this.neighbors.cyprus = ["natolia", "palestine", "syria"];
    this.neighbors.palestine = ["egypt", "cyprus", "syria"];
    this.neighbors.egypt = ["cyrenaica", "palestine"];

    const validProvinces = Provinces.GetProvinces();
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

  getNeighbors(provinceName: string) {
    const neighbors = this.neighbors[provinceName];
    if (neighbors === undefined) {
      return [];
    }

    return neighbors;
  }

  getPath(source: string, target: string): string[] {
    if (source === target) {
      return [];
    }

    const visited: string[] = [source];
    const path = this.getDistanceInternal(visited, target).path;
    path.shift();
    return path;
  }

  getDistance(source: string, target: string): number {
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
