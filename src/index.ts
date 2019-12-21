import $ from "jquery";
import { Greeter } from "./Globals";
import { Provinces } from "./Provinces";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceParser } from "./ProvincesParser";
import { HistoryChecker } from "./HistoryChecker";
import { BuildingChecker } from "./BuildingChecker";
import { Hud } from "./Hud";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { ProvinceHistory } from "./ProvinceHistory";
import { FarmHistoryChecker } from "./FarmHistoryChecker";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Clicker } from "./Clicker";
import { BuildingChanger } from "./BuildingChanger";

export class ConquerorSpy {
  static provinceParser: ProvinceParser;
  static provinceOwnership: ProvinceOwnership;
  static buildingChecker: BuildingChecker;
  static historyChecker: HistoryChecker;
  static hud: Hud;
  static provinceHistoryService: ProvinceHistoryService;

  static lastTurn: number = NaN;

  static lastCountry: string = "";

  static initialize() {
    const provinceHistoryService = new ProvinceHistoryService();
    ConquerorSpy.provinceHistoryService = provinceHistoryService;
    this.provinceParser = new ProvinceParser(provinceHistoryService);
    const provinceOwnership = new ProvinceOwnership();
    ConquerorSpy.provinceOwnership = provinceOwnership;
    const clicker = new Clicker();
    const buildingChanger = new BuildingChanger(clicker);
    ConquerorSpy.buildingChecker = new BuildingChecker(
      provinceOwnership,
      provinceHistoryService,
      buildingChanger
    );
    ConquerorSpy.historyChecker = new HistoryChecker(
      provinceOwnership,
      new ProvinceHistoryChecker(),
      new FarmHistoryChecker(),
      provinceHistoryService
    );
    ConquerorSpy.hud = new Hud(
      provinceOwnership,
      ConquerorSpy.historyChecker,
      provinceHistoryService
    );
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

    const toolVersion = "1.6 - wider hud";

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

    //
    ConquerorSpy.provinceHistoryService.reset();
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
