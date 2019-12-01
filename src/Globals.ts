import $ from "jquery";
import { Province } from "./Province";
import { ProvinceHistory } from "./ProvinceHistory";

export class Greeter {
  static provincesHistory: Record<string, ProvinceHistory> = {};
  static getTurn() {
    const turnSelector: string =
      "#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount";
    return parseInt(
      $(turnSelector)
        .text()
        .substring(5)
    );
  }
}
