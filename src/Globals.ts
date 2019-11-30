import $ from "jquery";
import { Province } from "./Province";

export class Greeter {
  static provincesHistory: Record<string, Province[]> = {};
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
