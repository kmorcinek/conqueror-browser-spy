import * as Sentry from "@sentry/browser";
import $ from "jquery";
import { Globals } from "./Globals";

Sentry.init({
  dsn:
    "https://d1f0d2ddff0bc0c4216617f7b4c27406@o4505684613988352.ingest.us.sentry.io/4511347682705408",
});
import { HistoryChecker } from "./HistoryChecker";
import { ProductionChecker } from "./ProductionChecker";
import { Hud } from "./Hud";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Clicker } from "./Clicker";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { ProvinceNeighborhood } from "./ProvinceNeighborhood";
import { GoldService } from "./GoldService";
import { Settings } from "./Settings";
import { ProvinceMapValidator } from "./ProvinceNeighborhood/ProvinceMapValidator";
import { AiManager } from "./ai/AiManager";
import { GameRestarter } from "./GameRestarter";
import { Version } from "./Version";
import { ProvinceParser } from "./ProvincesParser";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { createContainer } from "./container";

class ConquerorDocument extends Document {
  refreshTurnInterval: NodeJS.Timeout | undefined;
  refreshNameInterval: NodeJS.Timeout | undefined;
  refreshGameLobbyInterval: NodeJS.Timeout | undefined;
}

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

    const conquerorDocument = document as ConquerorDocument;
    clearInterval(conquerorDocument.refreshTurnInterval as NodeJS.Timeout);
    conquerorDocument.refreshTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    clearInterval(conquerorDocument.refreshNameInterval as NodeJS.Timeout);
    conquerorDocument.refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    clearInterval(conquerorDocument.refreshGameLobbyInterval as NodeJS.Timeout);
    conquerorDocument.refreshGameLobbyInterval = setInterval(ConquerorSpy.refreshGameLobby, 2000);

    console.log("Tool version: " + Version.getFullVersion());
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
    const element = document.getElementById(elementId) as HTMLInputElement;
    if (element === null) {
      return defaultValue;
    }
    return element.checked;
  }

  private static constructObjects() {
    const c = createContainer(ConquerorSpy.clicker, ConquerorSpy.provinceMapValidator);
    ConquerorSpy.settings = c.settings;
    ConquerorSpy.goldService = c.goldService;
    ConquerorSpy.provinceHistoryService = c.provinceHistoryService;
    this.provinceParser = c.provinceParser;
    ConquerorSpy.provinceOwnership = c.provinceOwnership;
    ConquerorSpy.provinceNeighborhood = c.provinceNeighborhood;
    ConquerorSpy.productionChecker = c.productionChecker;
    ConquerorSpy.historyChecker = c.historyChecker;
    ConquerorSpy.hud = c.hud;
    ConquerorSpy.aiManager = c.aiManager;
    ConquerorSpy.gameRestarter = c.gameRestarter;
  }

  private static refreshTurn() {
    try {
      ConquerorSpy.refreshTurnInternal();
    } catch (error) {
      console.error(error);
      Sentry.captureException(error);
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
      Sentry.captureMessage("game is over", "info");
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

      if (!ConquerorSpy.settings.hasMoreThan2Players()) {
        ConquerorSpy.aiManager.run();
      }

      console.log("---------- refreshTurn() finished");
    }
  }

  private static isGameOver(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const maybeGameOverElement: any = $(".content")[0];
    return maybeGameOverElement.outerText === "Game Over !!!";
  }

  private static isInGameLobby(): boolean {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
      Sentry.captureException(error);
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
      Sentry.captureException(error);
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
  Sentry.captureException(error);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as any).conquerorSpy = ConquerorSpy;
