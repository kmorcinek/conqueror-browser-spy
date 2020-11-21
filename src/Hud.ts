import $ from "jquery";
import { Province } from "./Province";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { HistoryChecker } from "./HistoryChecker";
import { IPrediction } from "./IPrediction";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Globals } from "./Globals";

export class Hud {
  private readonly provinceOwnership: IProvinceOwnership;
  private readonly historyChecker: HistoryChecker;
  private readonly provinceHistoryService: ProvinceHistoryService;
  private readonly selector = "#hud";
  private readonly hudWrapperSelector = "#hud-wrapper";

  constructor(
    provinceOwnership: IProvinceOwnership,
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
      this.clearHud();
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

  initHudWrapper() {
    const hudWrapper = $(
      '<div id="hud-wrapper" style="margin-top: 20px;">' +
        "  <div>" +
        '    <label for="run-ai">Run AI</label>' +
        '      <input type="checkbox" name="run-ai" id="run-ai" onchange="conquerorSpy.updateRunAi()" checked="checked">' +
        "    </div>" +
        "    <div>" +
        '      <label for="auto-end-turn">Auto et</label>' +
        '      <input type="checkbox" name="auto-end-turn" id="auto-end-turn" onchange="conquerorSpy.updateAutoEndTurn()">' +
        "    </div>" +
        '  <div id="hud" style="color: blue; background-color: white;"></div>' +
        "</div>"
    );

    if ($(this.hudWrapperSelector).length) {
      $(this.hudWrapperSelector).replaceWith(hudWrapper);
    } else {
      const timerWrapper = $(Globals.timerWrapperSelector);

      timerWrapper.append(hudWrapper);
    }
  }

  private clearHud() {
    this.initHudWrapper();
    $(this.selector).text("");
  }

  private updateHudHtml(html: string) {
    this.initHudWrapper();
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
