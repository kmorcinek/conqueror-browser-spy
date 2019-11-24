import $ from "jquery";

export class Greeter {
  static provincesHistory: any = {};
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
