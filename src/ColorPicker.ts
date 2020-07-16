import { Globals } from "./Globals";

export class ColorPicker {
  static getColor(provinceName: string) {
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
    }

    const mapDocument = Globals.getMapDocument();
    const map = mapDocument.getElementById(createId("field_", provinceName));
    if (map == null) {
      throw new Error(`map is null when picking color`);
    }

    const color = map.getAttribute("fill")!;
    // console.log(`Color: '${color}'`);
    return color;
  }
}
