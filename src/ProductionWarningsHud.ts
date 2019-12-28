import $ from "jquery";
import { Greeter } from "./Globals";

export class ProductionWarningsHud {
  static initHud() {
    if ($(ProductionWarningsHud.selector).length) {
      return;
    }

    const timerWrapper = $(Greeter.timerWrapperSelector);

    const productionWarningsElement = $(
      '<div id="production-warnings" style="margin-top: 20px; color: blue; background-color: gray; width: 400px;">koniczek konicze koniczekk koniczek</div>'
    );
    timerWrapper.append(productionWarningsElement);
  }
  private static selector = "#production-warnings";

  update(text: string) {
    this.updateHud(text);
  }

  private updateHud(text: string) {
    ProductionWarningsHud.initHud();
    $(ProductionWarningsHud.selector).text(text);
  }
}
