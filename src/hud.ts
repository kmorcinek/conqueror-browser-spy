import $ from "jquery";
import { Greeter } from "./globals";
import { ProvinceOwnership } from "./provinceOwnership";

export class Hud {
  private provinceOwnership: ProvinceOwnership;

  constructor(provinceOwnership: ProvinceOwnership) {
    this.provinceOwnership = provinceOwnership;
  }

  refreshHudHistory(countryName: string) {
    function lineIt(details: any) {
      let fort = "";
      if (details.fort) {
        fort = "," + details.fort[0];
      }

      return (
        details.turn + ": " + details.population + details.culture + fort + "," + details.soldiers
      );
    }

    if (this.provinceOwnership.getConqueredProvinces().includes(countryName)) {
      this.updateHud("");
      return;
    }

    const history = Greeter.provincesHistory[countryName];

    const lines = [];
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

  private isTheSameProvinceExceptTurn(first: any, second: any) {
    return (
      first.population === second.population &&
      first.culture === second.culture &&
      // && first.production === second.production // this is only our prediction
      first.soldiers === second.soldiers &&
      first.fort === second.fort
    );
  }

  private isHistoryEntryUnique(history: any[], currentIndex: number) {
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
