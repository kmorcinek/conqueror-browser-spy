import { Greeter } from "./Globals";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceParser } from "./ProvincesParser";
import { HistoryChecker } from "./HistoryChecker";
import { BuildingChecker } from "./BuildingChecker";
import { Hud } from "./Hud";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
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
    const provinceOwnership = new ProvinceOwnership(provinceHistoryService);
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

    clearInterval((document as any).refrestTurnInterval);
    (document as any).refrestTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    clearInterval((document as any).refreshNameInterval);
    (document as any).refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    const toolVersion = "1.7 - change province production";

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
    ConquerorSpy.provinceHistoryService.reset();
    ConquerorSpy.historyChecker.reset();
    ConquerorSpy.buildingChecker.reset();
    ConquerorSpy.provinceOwnership.reset();
  }

  static refreshName() {
    const country = Greeter.getCountry();
    if (country !== ConquerorSpy.lastCountry) {
      ConquerorSpy.lastCountry = country;
      ConquerorSpy.hud.refreshHudHistory(country);
    }
  }
}

ConquerorSpy.initialize();
ConquerorSpy.start();
