import $ from "jquery";
import { Greeter } from "./Globals";
import { Provinces } from "./Provinces";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceParser } from "./ProvincesParser";
import { HistoryChecker } from "./HistoryChecker";
import { BuildingChecker } from "./BuildingChecker";
import { Hud } from "./Hud";
import { ProcinceHistoryChecker } from "./ProvinceHistoryChecker";

export class ConquerorSpy {
  static provinceParser: ProvinceParser = new ProvinceParser();
  static provinceOwnership: ProvinceOwnership;
  static buildingChecker: BuildingChecker;
  static historyChecker: HistoryChecker;
  static hud: Hud;

  static lastTurn: number = NaN;

  static lastCountry: string = "";

  static initialize() {
    const provinceOwnership = new ProvinceOwnership();
    ConquerorSpy.provinceOwnership = provinceOwnership;
    ConquerorSpy.buildingChecker = new BuildingChecker(provinceOwnership);
    ConquerorSpy.historyChecker = new HistoryChecker(
      provinceOwnership,
      new ProcinceHistoryChecker()
    );
    ConquerorSpy.hud = new Hud(provinceOwnership);
  }

  static start() {
    console.log("running conqueror-browser-spy");

    ConquerorSpy.cleanAllValues();

    let refrestTurnInterval;
    clearInterval(refrestTurnInterval);
    refrestTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    let refreshNameInterval;
    clearInterval(refreshNameInterval);
    refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    const toolVersion = "1.2 - at 11 turn 2+1 developing";

    console.log("tool version: " + toolVersion);
  }

  static refreshTurn() {
    const turn = Greeter.getTurn();

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
    // lastCountry = "";

    Greeter.provincesHistory = {};

    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      Greeter.provincesHistory[provinceName] = [];
    }

    ConquerorSpy.historyChecker.reset();
    ConquerorSpy.buildingChecker.reset();
    ConquerorSpy.provinceOwnership.reset();
  }

  static getCountry(): string {
    const countrySelector =
      "#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0 > div > div.fieldHeaderWrapper > div.fieldHeader > span";
    let text = $(countrySelector)
      .text()
      .toLowerCase();

    function removeDiacritics(str: string) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }

    text = removeDiacritics(text);

    if (text === "ile de france") {
      text = "iledefrance";
    }

    return text;
  }

  static refreshName() {
    const country = ConquerorSpy.getCountry();
    if (country !== ConquerorSpy.lastCountry) {
      ConquerorSpy.lastCountry = country;
      ConquerorSpy.hud.refreshHudHistory(country);
    }
  }
}

ConquerorSpy.initialize();
ConquerorSpy.start();
