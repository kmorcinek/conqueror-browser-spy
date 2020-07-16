import { Globals } from "../Globals";
import { IProvinceMapValidator } from "./IProvinceMapValidator";

export class ProvinceMapValidator implements IProvinceMapValidator {
  exists(provinceName: string): boolean {
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
    }

    const mapDocument = Globals.getMapDocument();
    const map = mapDocument.getElementById(createId("field_", provinceName));
    return map != null;
  }
}
