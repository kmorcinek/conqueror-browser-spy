export interface IProvinceOwnership {
  updateOwnedProvinces(): void;
  getConqueredProvinces(): string[];
  getOwnedProvinces(): string[];
  reset(): void;
}
