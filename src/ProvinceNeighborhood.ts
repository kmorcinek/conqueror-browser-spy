import { IProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/IProvinceNeighbourhoodProvider";
import { IProvinceMapValidator } from "./ProvinceNeighborhood/IProvinceMapValidator";

export class ProvinceNeighborhood {
  neighbors: Record<string, string[]> = {};
  cachedDistances: Record<string, number> = {};
  cachedPath: Record<string, string[]> = {};

  constructor(
    neighbourhoodProviders: IProvinceNeighbourhoodProvider[],
    provinceMapValidator: IProvinceMapValidator
  ) {
    for (const provider of neighbourhoodProviders) {
      this.assignProvinces(provider, provinceMapValidator);
    }
    const length = Object.keys(this.neighbors).length;
    console.log(`provinces on the map ${length}`);
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

  private assignProvinces(
    provider: IProvinceNeighbourhoodProvider,
    provinceMapValidator: IProvinceMapValidator
  ) {
    const neighborhood = provider.getNeighborhood();
    for (const province of Object.keys(neighborhood)) {
      if (provinceMapValidator.exists(province)) {
        this.neighbors[province] = neighborhood[province].filter(name =>
          provinceMapValidator.exists(name)
        );
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
