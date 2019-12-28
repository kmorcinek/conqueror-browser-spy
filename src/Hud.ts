import $ from "jquery";
import { Province } from "./Province";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { HistoryChecker } from "./HistoryChecker";
import { IPrediction } from "./IPrediction";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Greeter } from "./Globals";

export class Hud {
  private provinceOwnership: ProvinceOwnership;
  private historyChecker: HistoryChecker;
  private provinceHistoryService: ProvinceHistoryService;
  private selector = "#hud";

  constructor(
    provinceOwnership: ProvinceOwnership,
    historyChecker: HistoryChecker,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.provinceOwnership = provinceOwnership;
    this.historyChecker = historyChecker;
    this.provinceHistoryService = provinceHistoryService;
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

    const history: Province[] = this.provinceHistoryService.getByName(provinceName).getHistory();

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
    if ($(this.selector).length) {
      return;
    }

    const timerWrapper = $(Greeter.timerWrapperSelector);

    const hud = $(
      '<div id="hud" style="margin-top: 20px; color: blue; background-color: white;"></div>'
    );
    timerWrapper.append(hud);
  }

  private updateHud(text: string) {
    this.initHud();
    $(this.selector).text(text);
  }

  private updateHudHtml(html: string) {
    this.initHud();
    $(this.selector).html(html);
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
