import { IProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/IProvinceNeighbourhoodProvider";
import { IProvinceMapValidator } from "./ProvinceNeighborhood/IProvinceMapValidator";

class Cache<T> {
  dictionary: Record<string, T> = {};

  getCached(source: string, target: string, getFreshData: (a: string, b: string) => T): T {
    const key = Cache.concatWay(source, target);
    const cachedData = this.dictionary[key];
    if (cachedData !== undefined) {
      return cachedData;
    }

    const freshData = getFreshData(source, target);
    this.dictionary[key] = freshData;
    return freshData;
  }

  // tslint:disable-next-line: member-ordering
  private static concatWay(source: string, target: string) {
    return source + ";" + target;
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

export class ProvinceNeighborhood {
  private readonly neighbourhoodProviders: IProvinceNeighbourhoodProvider[];
  private readonly provinceMapValidator: IProvinceMapValidator;

  private readonly neighbors: Record<string, string[]> = {};

  private readonly distanceCache: Cache<number> = new Cache<number>();
  private readonly pathCache: Cache<string[]> = new Cache<string[]>();
  private readonly manyPathCache: Cache<string[][]> = new Cache<string[][]>();

  constructor(
    neighbourhoodProviders: IProvinceNeighbourhoodProvider[],
    provinceMapValidator: IProvinceMapValidator
  ) {
    this.neighbourhoodProviders = neighbourhoodProviders;
    this.provinceMapValidator = provinceMapValidator;

    this.reset();
  }

  reset() {
    for (const provider of this.neighbourhoodProviders) {
      this.assignProvinces(provider, this.provinceMapValidator);
    }
    const length = Object.keys(this.neighbors).length;
    console.log(`Provinces on the map ${length}`);
  }

  getNeighbors(provinceName: string) {
    const neighbors = this.neighbors[provinceName];
    if (neighbors === undefined) {
      return [];
    }

    return neighbors;
  }

  getPath(source: string, target: string): string[] {
    return this.pathCache.getCached(source, target, (src, dest) =>
      this.getPathNotCached(src, dest)
    );
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
    return this.distanceCache.getCached(source, target, (src, dest) =>
      this.getDistanceNotCached(src, dest)
    );
  }

  getManyPathWithDistance2(source: string, target: string): string[][] {
    return this.manyPathCache.getCached(source, target, (src, dest) =>
      this.getManyPathWithDistance2NotCached(src, dest)
    );
  }

  private getManyPathWithDistance2NotCached(source: string, target: string): string[][] {
    const manyPath: string[][] = [];
    if (this.getDistance(source, target) !== 2) {
      throw new Error(`Distance from ${source} to ${target} is required to be 2`);
    }

    const firstLineOfNeighbors = this.getNeighbors(source);
    for (const firstNeighbor of firstLineOfNeighbors) {
      const secondLineOfNeighbors = this.getNeighbors(firstNeighbor);
      for (const secondNeighbor of secondLineOfNeighbors) {
        if (secondNeighbor === target) {
          manyPath.push([firstNeighbor, secondNeighbor]);
        }
      }
    }

    return manyPath;
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
