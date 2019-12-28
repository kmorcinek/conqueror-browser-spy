export interface IProvinceOwnership {
  updateOwnedProvinces(): void;
  getConqueredProvinces(): string[];
  getOwnedProvinces(): string[];
  getNotOwned(provinces: string[]): string[];
  filterOpponents(provinces: string[]): string[];
  filterNeutral(provinces: string[]): string[];
  reset(): void;
}
