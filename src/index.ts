import $ from "jquery";
import { Globals } from "./Globals";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceParser } from "./ProvincesParser";
import { HistoryChecker } from "./HistoryChecker";
import { ProductionChecker } from "./ProductionChecker";
import { Hud } from "./Hud";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { FarmHistoryChecker } from "./FarmHistoryChecker";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Clicker } from "./Clicker";
import { BuildingChanger } from "./BuildingChanger";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { ProvinceProductionAi } from "./ai/ProvinceProductionAi";
import { ArmyMoverAi } from "./ai/ArmyMoverAi";
import { ProvinceNeighborhood } from "./ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "./ProvinceNeighborhoods";
import { GoldService } from "./GoldService";
import { TinyMapProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/TinyMapProvinceNeighbourhoodProvider";
import { ArmyMovesRecorder } from "./ai/ArmyMovesRecorder";
import { BattleProvinceNeighborhoods } from "./ai/BattleProvinceNeighborhoods";
import { Settings } from "./Settings";
import { ArmyMarcher } from "./ai/ArmyMarcher";
import { ProvinceMapValidator } from "./ProvinceNeighborhood/ProvinceMapValidator";
import { EuropeMapProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/EuropeMapProvinceNeighborhoodProvider";
import { AiManager } from "./ai/AiManager";
import { OpponentAttacker } from "./ai/OpponentAttacker";
import { Backlands } from "./ai/backland/Backlands";
import { BacklandProductionAi } from "./ai/backland/BacklandProductionAi";
import { NeutralAttacker } from "./ai/NeutralAttacker";
import { StaticProductionChecker } from "./StaticProductionChecker";
import { DynamicProductionChecker } from "./DynamicProductionChecker";
import { CapitalFinder } from "./CapitalFinder";
import { BrowserHtmlDocument } from "./BrowserHtmlDocument";
import { GameRestarter } from "./GameRestarter";
import { Version } from "./Version";
import { Winner } from "./statistics/Winner";
import { Statistics } from "./statistics/Statistics";

export class ConquerorSpy {
  static provinceParser: ProvinceParser;
  static provinceOwnership: IProvinceOwnership;
  static provinceNeighborhood: ProvinceNeighborhood;
  static productionChecker: ProductionChecker;
  static historyChecker: HistoryChecker;
  static hud: Hud;
  static provinceHistoryService: ProvinceHistoryService;
  static goldService: GoldService;
  static settings: Settings;
  static aiManager: AiManager;
  static provinceMapValidator: ProvinceMapValidator = new ProvinceMapValidator();
  static clicker = new Clicker();
  static gameRestarter: GameRestarter;

  static lastTurn: number = NaN;

  static lastCountry: string | null = null;

  static initialize() {
    console.log("initialize conqueror-browser-spy");
    this.constructObjects();

    ConquerorSpy.hud.hardInitHudWrapper();
    this.updateRunAi();
    this.updateAutoEndTurn();

    ProductionWarningsHud.initHud();
  }

  static start() {
    console.log("Running conqueror-browser-spy");

    ConquerorSpy.cleanAllValues();

    clearInterval((document as any).refreshTurnInterval);
    (document as any).refreshTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    clearInterval((document as any).refreshNameInterval);
    (document as any).refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    clearInterval((document as any).refreshGameLobbyInterval);
    (document as any).refreshGameLobbyInterval = setInterval(ConquerorSpy.refreshGameLobby, 2000);

    console.log("Tool version: " + Version.getFullVersion());
    Statistics.logKey();
  }

  static simulateStartNewAiGame() {
    this.gameRestarter.startNewAiGame();
  }

  static simulateExit() {
    this.gameRestarter.exitGameAfterSound();
  }

  static giveUpGame() {
    this.gameRestarter.giveUpGame();
  }

  // changeRestartNewGame is called from browser console like:
  // `conquerorSpy.changeRestartNewGame(true);`
  static changeRestartNewGame(state: boolean) {
    this.gameRestarter.changeRestartNewGame(state);
  }

  static updateRunAi() {
    const checked = this.getCheckedState("run-ai", true);
    ConquerorSpy.aiManager.updateRunAi(checked);
  }

  static updateAutoEndTurn() {
    const checked = this.getCheckedState("auto-end-turn", false);
    ConquerorSpy.aiManager.updateAutoEndTurn(checked);
  }

  private static getCheckedState(elementId: string, defaultValue: boolean): boolean {
    const element = document.getElementById(elementId)! as any;
    if (element === null) {
      return defaultValue;
    }
    return element.checked;
  }

  private static constructObjects() {
    const goldService = new GoldService();
    const capitalFinder = new CapitalFinder(new BrowserHtmlDocument());
    const settings = new Settings(capitalFinder);
    ConquerorSpy.settings = settings;
    ConquerorSpy.goldService = goldService;
    const productionWarningsHud = new ProductionWarningsHud();
    const provinceHistoryService = new ProvinceHistoryService();
    const provinceNeighborhood = new ProvinceNeighborhood(
      [new EuropeMapProvinceNeighbourhoodProvider(), new TinyMapProvinceNeighbourhoodProvider()],
      ConquerorSpy.provinceMapValidator
    );
    ConquerorSpy.provinceHistoryService = provinceHistoryService;
    const clicker = ConquerorSpy.clicker;
    this.provinceParser = new ProvinceParser(provinceHistoryService, clicker);
    const provinceOwnership: IProvinceOwnership = new ProvinceOwnership(
      provinceHistoryService,
      ConquerorSpy.provinceMapValidator,
      settings
    );
    const provinceNeighborhoods = new ProvinceNeighborhoods(
      provinceOwnership,
      provinceNeighborhood
    );
    ConquerorSpy.provinceOwnership = provinceOwnership;
    ConquerorSpy.provinceNeighborhood = provinceNeighborhood;
    const buildingChanger = new BuildingChanger(clicker);
    ConquerorSpy.productionChecker = new ProductionChecker(
      provinceOwnership,
      provinceHistoryService,
      productionWarningsHud,
      new StaticProductionChecker(),
      new DynamicProductionChecker(),
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
    const battleProvinceNeighborhoods = new BattleProvinceNeighborhoods(
      settings,
      provinceOwnership,
      provinceNeighborhood,
      provinceNeighborhoods,
      provinceHistoryService
    );
    const backlands = new Backlands(battleProvinceNeighborhoods);
    const backlandProductionAi = new BacklandProductionAi(goldService, settings);
    const provinceProductionAi = new ProvinceProductionAi(
      clicker,
      battleProvinceNeighborhoods,
      backlands,
      backlandProductionAi,
      goldService
    );
    const armyMovesRecorder = new ArmyMovesRecorder();
    const armyMoverAi = new ArmyMoverAi(
      clicker,
      battleProvinceNeighborhoods,
      new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder),
      new OpponentAttacker(armyMovesRecorder),
      new NeutralAttacker(armyMovesRecorder),
      armyMovesRecorder
    );
    ConquerorSpy.aiManager = new AiManager(
      battleProvinceNeighborhoods,
      backlands,
      armyMoverAi,
      provinceProductionAi
    );

    ConquerorSpy.gameRestarter = new GameRestarter(
      new Statistics(),
      new Winner(settings, provinceOwnership)
    );
  }

  private static refreshTurn() {
    try {
      ConquerorSpy.refreshTurnInternal();
    } catch (error) {
      console.error(error);
    }
  }

  private static refreshTurnInternal() {
    const turn = Globals.getTurn();

    if (isNaN(turn)) {
      // hacky way of resetting lastTurn, without it when we exit game at turn 1 and start new game
      // it will be not treated as new game
      ConquerorSpy.lastTurn = NaN;

      ConquerorSpy.settings.unsetEverything();
      return;
    }

    if (this.isGameOver()) {
      console.log("game is over");
      this.gameRestarter.exitGameAfterSound();
    }

    // here can be log

    if (turn !== ConquerorSpy.lastTurn) {
      if (turn === 1) {
        ConquerorSpy.cleanAllValues();
      }

      ConquerorSpy.settings.setEverything();
      ConquerorSpy.settings.setTurn(turn);
      ConquerorSpy.lastTurn = turn;

      console.log("");
      console.log("New turn: ", ConquerorSpy.lastTurn);
      ConquerorSpy.goldService.update();
      ConquerorSpy.provinceParser.updateProvinces();
      ConquerorSpy.historyChecker.checkProvinces();
      ConquerorSpy.provinceOwnership.updateOwnedProvinces();
      ConquerorSpy.productionChecker.checkBuildingProvinces(this.settings.getSeason());

      ConquerorSpy.aiManager.run();

      console.log("---------- refreshTurn() finished");
    }
  }

  private static isGameOver(): boolean {
    const maybeGameOverElement: any = $(".content")[0];
    return maybeGameOverElement.outerText === "Game Over !!!";
  }

  private static isInGameLobby(): boolean {
    const element: any = $(Globals.singleplayerButtonSelector);
    const firstElement = element[0];
    if (firstElement === undefined) {
      return false;
    }
    return firstElement.outerText === "Singleplayer";
  }

  private static cleanAllValues() {
    ConquerorSpy.provinceHistoryService.reset();
    ConquerorSpy.historyChecker.reset();
    ConquerorSpy.productionChecker.reset();
    ConquerorSpy.provinceOwnership.reset();
    ConquerorSpy.provinceNeighborhood.reset();
  }

  private static refreshName() {
    try {
      ConquerorSpy.refreshNameInternal();
    } catch (error) {
      console.error(error);
    }
  }

  private static refreshNameInternal() {
    const country = Globals.getCountry();
    if (country !== ConquerorSpy.lastCountry && country !== null) {
      ConquerorSpy.lastCountry = country;
      ConquerorSpy.hud.refreshHudHistory(country);
    }
  }

  private static refreshGameLobby() {
    // console.log("refreshGameLobby");
    try {
      ConquerorSpy.refreshGameLobbyInternal();
    } catch (error) {
      console.error(error);
    }
  }

  private static refreshGameLobbyInternal() {
    if (this.isInGameLobby()) {
      this.gameRestarter.startNewAiGame();
    }
  }
}

try {
  ConquerorSpy.initialize();
  ConquerorSpy.start();
} catch (error) {
  console.error(error);
}

(window as any).conquerorSpy = ConquerorSpy;
