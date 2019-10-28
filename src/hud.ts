import $ from "jquery"
import { Greeter } from "./globals";
import { ProvinceOwnership } from "./provinceOwnership";

export class Hud {

    private provinceOwnership: ProvinceOwnership;

    constructor(provinceOwnership: ProvinceOwnership) {
        this.provinceOwnership = provinceOwnership;
    }

    initHud() {
        if ($('#hud').length) {
            return;
        }

        var timerWrapperSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnTimer';

        var timerWrapper = $(timerWrapperSelector);

        var hud = $('<div id="hud" style="margin-top: 20px;"></div>');
        timerWrapper.append(hud);
    }

    updateHud(text: string) {
        this.initHud();
        $('#hud').text(text);
    }

    updateHudHtml(html: string) {
        this.initHud();
        $('#hud').html(html);
    }

    isTheSameProvinceExceptTurn(first:any, second:any) {
        return first.population === second.population
            && first.culture === second.culture
            // && first.production === second.production // this is only our prediction
            && first.soldiers === second.soldiers
            && first.fort === second.fort;
    }

    isHistoryEntryUnique(history:any[], currentIndex:number) {
        if (currentIndex === 0) {
            return true;
        }

        if (currentIndex === history.length - 1) {
            return true;
        }

        return !this.isTheSameProvinceExceptTurn(history[currentIndex - 1], history[currentIndex])
            || !this.isTheSameProvinceExceptTurn(history[currentIndex], history[currentIndex + 1]);
    }

    public refreshHudHistory(countryName:string) {
        function lineIt(details:any) {
            var fort = "";
            if (details.fort) {
                fort = "," + details.fort[0];
            }

            return details.turn + ": " + details.population + details.culture + fort + "," + details.soldiers;
        }

        if (this.provinceOwnership.conqueredProvinces.includes(countryName)) {
            this.updateHud("");
            return;
        }

        var history = Greeter.provincesHistory[countryName];

        var lines = [];
        for (var i = history.length - 1; i > -1; i--) {
            if (this.isHistoryEntryUnique(history, i)) {
                lines.push(lineIt(history[i]));
            }
        }

        this.updateHudHtml(lines.join("<br>"));
    }
}