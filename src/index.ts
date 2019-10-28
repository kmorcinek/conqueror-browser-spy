import $ from "jquery"
import { Greeter } from "./globals";
import { Provinces } from "./provinces";
import { ProvinceOwnership } from "./provinceOwnership";
import { ProvinceParser } from "./provincesParser";
import { HistoryChecker } from "./historyChecker";
import { BuildingChecker } from "./buildingChecker";
import { Hud } from "./hud";

export class ConquerorSpy {

    static provinceParser: ProvinceParser = new ProvinceParser();
    static provinceOwnership: ProvinceOwnership;
    static buildingChecker: BuildingChecker;
    static historyChecker: HistoryChecker;
    static hud: Hud;

    static initialize() {
        let provinceOwnership = new ProvinceOwnership();
        ConquerorSpy.provinceOwnership = provinceOwnership;
        ConquerorSpy.buildingChecker = new BuildingChecker(provinceOwnership);
        ConquerorSpy.historyChecker = new HistoryChecker(provinceOwnership);
        ConquerorSpy.hud = new Hud(provinceOwnership);
    }

    public static start() {
        console.log('running conqueror-browser-spy');

        ConquerorSpy.cleanAllValues()

        var refrestTurnInterval;
        clearInterval(refrestTurnInterval);
        refrestTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

        var refreshNameInterval;
        clearInterval(refreshNameInterval);
        refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

        var toolVersion = '1.1';

        console.log("tool version: " + toolVersion);
    }

    public static lastTurn: number = NaN;

    static refreshTurn() {
        var turn = Greeter.getTurn();

        if (isNaN(turn)) {
            return;
        }

        if (turn !== ConquerorSpy.lastTurn) {
            if (turn === 1) {
                ConquerorSpy.cleanAllValues();
            }

            ConquerorSpy.lastTurn = turn;
            console.log("New turn: ", ConquerorSpy.lastTurn);
            ConquerorSpy.provinceParser.updateProvinces();
            ConquerorSpy.historyChecker.checkProvinces();
            ConquerorSpy.provinceOwnership.updateOwnedProvinces();
            ConquerorSpy.buildingChecker.checkBuildingProvinces();

            console.log("refreshTurn() finished");
        }
    }

    static cleanAllValues() {
        //lastCountry = "";

        Greeter.provincesHistory = {};

        let provinces = Provinces.GetProvinces();
        for (var i = 0; i < provinces.length; i++) {
            var provinceName = provinces[i];
            Greeter.provincesHistory[provinceName] = [];
        }

        ConquerorSpy.historyChecker.reset();
        ConquerorSpy.buildingChecker.reset();
        ConquerorSpy.provinceOwnership.reset();
    }

    static getCountry() {
        var countrySelector = '#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0 > div > div.fieldHeaderWrapper > div.fieldHeader > span'
        var text = $(countrySelector).text().toLowerCase();

        function removeDiacritics(str:string) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); }

        text = removeDiacritics(text);

        if (text === "ile de france") {
            text = "iledefrance";
        }

        return text;
    }

    static lastCountry: string = "";

    static refreshName() {
        var country = ConquerorSpy.getCountry();
        if (country !== ConquerorSpy.lastCountry) {
            ConquerorSpy.lastCountry = country;
            ConquerorSpy.hud.refreshHudHistory(country);
        }
    }

}

ConquerorSpy.initialize();
ConquerorSpy.start();
