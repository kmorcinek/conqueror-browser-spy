import { IProvinceMapValidator } from "../src/ProvinceNeighborhood/IProvinceMapValidator";

export class ProvinceMapValidatorMock implements IProvinceMapValidator {
  private readonly forbiddenProvinces: string[];

  constructor(forbiddenProvinces: string[]) {
    this.forbiddenProvinces = forbiddenProvinces;
  }

  exists(provinceName: string): boolean {
    return !this.forbiddenProvinces.includes(provinceName);
  }
}
