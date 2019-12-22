export interface IProvinceOwnership {
  updateOwnedProvinces(): void;
  getConqueredProvinces(): string[];
  getOwnedProvinces(): string[];
  getNotOwned(provinces: string[]): string[];
  reset(): void;
}
