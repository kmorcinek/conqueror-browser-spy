import $ from "jquery";
import { Greeter } from "./Globals";
import { Province } from "./Province";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { HistoryChecker } from "./HistoryChecker";
import { Production } from "./Production";
import { IPrediction } from "./IPrediction";

export class Hud {
  private provinceOwnership: ProvinceOwnership;
  private historyChecker: HistoryChecker;

  constructor(provinceOwnership: ProvinceOwnership, historyChecker: HistoryChecker) {
    this.provinceOwnership = provinceOwnership;
    this.historyChecker = historyChecker;
  }

  refreshHudHistory(provinceName: string) {
    function lineIt(details: Province) {
      let fort = "";
      if (details.fort) {
        fort = "," + details.fort[0];
      }

      return (
        details.turn +
        ": " +
        details.getPopulation() +
        details.culture +
        fort +
        "," +
        details.soldiers
      );
    }

    if (this.provinceOwnership.getConqueredProvinces().includes(provinceName)) {
      this.updateHud("");
      return;
    }

    const history: Province[] = Greeter.provincesHistory[provinceName].getHistory();

    const lines = [];

    const predictions: IPrediction[] = this.historyChecker.getPrediction(provinceName);
    if (predictions.length) {
      lines.push(predictions[0].getMessage());
    }
    for (let i = history.length - 1; i > -1; i--) {
      if (this.isHistoryEntryUnique(history, i)) {
        lines.push(lineIt(history[i]));
      }
    }

    this.updateHudHtml(lines.join("<br>"));
  }

  private initHud() {
    if ($("#hud").length) {
      return;
    }

    const timerWrapperSelector =
      "#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnTimer";

    const timerWrapper = $(timerWrapperSelector);

    const hud = $('<div id="hud" style="margin-top: 20px;"></div>');
    timerWrapper.append(hud);
  }

  private updateHud(text: string) {
    this.initHud();
    $("#hud").text(text);
  }

  private updateHudHtml(html: string) {
    this.initHud();
    $("#hud").html(html);
  }

  private isTheSameProvinceExceptTurn(first: Province, second: Province) {
    return (
      first.farms === second.farms &&
      first.resources === second.resources &&
      first.culture === second.culture &&
      // && first.production === second.production // this is only our prediction
      first.soldiers === second.soldiers &&
      first.fort === second.fort
    );
  }

  private isHistoryEntryUnique(history: Province[], currentIndex: number) {
    if (currentIndex === 0) {
      return true;
    }

    if (currentIndex === history.length - 1) {
      return true;
    }

    return (
      !this.isTheSameProvinceExceptTurn(history[currentIndex - 1], history[currentIndex]) ||
      !this.isTheSameProvinceExceptTurn(history[currentIndex], history[currentIndex + 1])
    );
  }
}
