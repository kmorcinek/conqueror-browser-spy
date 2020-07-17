export interface IProvinceOwnership {
  updateOwnedProvinces(): void;
  getConqueredProvinces(): string[];
  getOwnedProvinces(): string[];
  getOpponentProvinces(): string[];
  getNeutralProvinces(): string[];
  getAllProvinces(): string[];
  getNotOwned(provinces: string[]): string[];
  filterOpponents(provinces: string[]): string[];
  filterNeutral(provinces: string[]): string[];
  reset(): void;
}
