import { Globals } from "../Globals";
import { IProvinceMapValidator } from "./IProvinceMapValidator";
import { MapUtils } from "../MapUtils";

export class ProvinceMapValidator implements IProvinceMapValidator {
  exists(provinceName: string): boolean {
    const mapDocument = Globals.getMapDocument();
    const map = mapDocument.getElementById(MapUtils.createId("field_", provinceName));
    return map != null;
  }
}
