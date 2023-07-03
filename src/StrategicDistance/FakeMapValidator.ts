import { IProvinceMapValidator } from "../ProvinceNeighborhood/IProvinceMapValidator";

export class FakeMapValidator implements IProvinceMapValidator {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exists(provinceName: string): boolean {
    return true;
  }
}
