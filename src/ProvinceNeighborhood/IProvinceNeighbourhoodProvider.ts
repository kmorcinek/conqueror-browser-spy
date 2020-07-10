export interface IProvinceNeighbourhoodProvider {
  getNeighborhood(): Record<string, string[]>;
}
