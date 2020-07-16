import { Globals } from "./Globals";
import { MapUtils } from "./MapUtils";

export class ColorPicker {
  static getColor(provinceName: string) {
    const mapDocument = Globals.getMapDocument();
    const map = mapDocument.getElementById(MapUtils.createId("field_", provinceName));
    if (map == null) {
      throw new Error(`map is null when picking color`);
    }

    const color = map.getAttribute("fill")!;
    // console.log(`Color: '${color}'`);
    return color;
  }
}
