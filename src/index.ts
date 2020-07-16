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

export class ConquerorSpy {
  static provinceParser: ProvinceParser;
  static provinceOwnership: IProvinceOwnership;
  static productionChecker: ProductionChecker;
  static historyChecker: HistoryChecker;
  static hud: Hud;
  static provinceHistoryService: ProvinceHistoryService;
  static goldService: GoldService;
  static settings: Settings;
  static aiManager: AiManager;
  static provinceMapValidator: ProvinceMapValidator = new ProvinceMapValidator();
  static clicker = new Clicker();

  static lastTurn: number = NaN;

  static lastCountry: string = "";

  static initialize() {
    ProductionWarningsHud.initHud();
    const goldService = new GoldService();
    const settings = new Settings();
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
    const buildingChanger = new BuildingChanger(clicker);
    ConquerorSpy.productionChecker = new ProductionChecker(
      provinceOwnership,
      provinceHistoryService,
      productionWarningsHud,
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
      provinceOwnership,
      provinceNeighborhood,
      provinceNeighborhoods,
      provinceHistoryService
    );
    const provinceProductionAi = new ProvinceProductionAi(
      clicker,
      battleProvinceNeighborhoods,
      goldService
    );
    const armyMovesRecorder = new ArmyMovesRecorder();
    const armyMoverAi = new ArmyMoverAi(
      clicker,
      battleProvinceNeighborhoods,
      new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder),
      armyMovesRecorder
    );
    ConquerorSpy.aiManager = new AiManager(
      battleProvinceNeighborhoods,
      armyMoverAi,
      provinceProductionAi
    );
  }

  static start() {
    console.log("running conqueror-browser-spy");

    ConquerorSpy.cleanAllValues();

    clearInterval((document as any).refrestTurnInterval);
    (document as any).refrestTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    clearInterval((document as any).refreshNameInterval);
    (document as any).refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    const toolVersion = "1.8.6 - PROD version is not showing history for owned provinces";

    console.log("tool version: " + toolVersion);
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
      return;
    }

    if (turn !== ConquerorSpy.lastTurn) {
      if (turn === 1) {
        ConquerorSpy.cleanAllValues();
      }

      ConquerorSpy.settings.setMyCapital();

      ConquerorSpy.lastTurn = turn;
      console.log("New turn: ", ConquerorSpy.lastTurn);
      ConquerorSpy.goldService.update();
      ConquerorSpy.provinceParser.updateProvinces();
      ConquerorSpy.historyChecker.checkProvinces();
      ConquerorSpy.provinceOwnership.updateOwnedProvinces();
      ConquerorSpy.productionChecker.checkBuildingProvinces();

      ConquerorSpy.aiManager.run();

      console.log("---------- refreshTurn() finished");
    }
  }

  private static cleanAllValues() {
    ConquerorSpy.provinceHistoryService.reset();
    ConquerorSpy.historyChecker.reset();
    ConquerorSpy.productionChecker.reset();
    ConquerorSpy.provinceOwnership.reset();
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
    if (country !== ConquerorSpy.lastCountry) {
      ConquerorSpy.lastCountry = country;
      ConquerorSpy.hud.refreshHudHistory(country);
    }
  }
}

ConquerorSpy.initialize();
ConquerorSpy.start();
