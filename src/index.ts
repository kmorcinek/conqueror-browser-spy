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

export class ConquerorSpy {
  static provinceParser: ProvinceParser;
  static provinceOwnership: IProvinceOwnership;
  static productionChecker: ProductionChecker;
  static historyChecker: HistoryChecker;
  static hud: Hud;
  static provinceHistoryService: ProvinceHistoryService;
  static provinceProductionAi: ProvinceProductionAi;
  static armyMoverAi: ArmyMoverAi;
  static goldService: GoldService;
  static clicker = new Clicker();

  static lastTurn: number = NaN;

  static lastCountry: string = "";

  static initialize() {
    ProductionWarningsHud.initHud();
    const goldService = new GoldService();
    ConquerorSpy.goldService = goldService;
    const productionWarningsHud = new ProductionWarningsHud();
    const provinceHistoryService = new ProvinceHistoryService();
    const provinceNeighborhood = new ProvinceNeighborhood([
      new TinyMapProvinceNeighbourhoodProvider(),
    ]);
    ConquerorSpy.provinceHistoryService = provinceHistoryService;
    const clicker = ConquerorSpy.clicker;
    this.provinceParser = new ProvinceParser(provinceHistoryService, clicker);
    const provinceOwnership: IProvinceOwnership = new ProvinceOwnership(provinceHistoryService);
    const provinceNeighborhoods = new ProvinceNeighborhoods(
      provinceOwnership,
      provinceNeighborhood
    );
    ConquerorSpy.provinceOwnership = provinceOwnership;
    const buildingChanger = new BuildingChanger(clicker);
    ConquerorSpy.provinceProductionAi = new ProvinceProductionAi(
      clicker,
      goldService,
      provinceOwnership,
      provinceNeighborhood,
      provinceHistoryService
    );
    ConquerorSpy.armyMoverAi = new ArmyMoverAi(
      clicker,
      provinceNeighborhood,
      new BattleProvinceNeighborhoods(
        provinceOwnership,
        provinceNeighborhood,
        provinceNeighborhoods,
        provinceHistoryService
      ),
      new ArmyMovesRecorder()
    );
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
  }

  static start() {
    console.log("running conqueror-browser-spy");

    ConquerorSpy.cleanAllValues();

    clearInterval((document as any).refrestTurnInterval);
    (document as any).refrestTurnInterval = setInterval(ConquerorSpy.refreshTurn, 500);

    clearInterval((document as any).refreshNameInterval);
    (document as any).refreshNameInterval = setInterval(ConquerorSpy.refreshName, 200);

    const toolVersion = "1.8.3 - tiny neighborhood";

    console.log("tool version: " + toolVersion);
  }

  static refreshTurn() {
    const turn = Globals.getTurn();

    if (isNaN(turn)) {
      return;
    }

    if (turn !== ConquerorSpy.lastTurn) {
      if (turn === 1) {
        ConquerorSpy.cleanAllValues();
      }

      ConquerorSpy.lastTurn = turn;
      console.log("New turn: ", ConquerorSpy.lastTurn);
      ConquerorSpy.goldService.update();
      ConquerorSpy.provinceParser.updateProvinces();
      ConquerorSpy.historyChecker.checkProvinces();
      ConquerorSpy.provinceOwnership.updateOwnedProvinces();
      ConquerorSpy.productionChecker.checkBuildingProvinces();

      // AI
      const runAi: boolean = false;
      if (runAi) {
        ConquerorSpy.provinceProductionAi.updateAllProvinces();
        ConquerorSpy.armyMoverAi.moveArmies();
        window.setTimeout(function() {
          ConquerorSpy.clicker.clickEndTurn();
        }, 2000);
      }

      console.log("---------- refreshTurn() finished");
    }
  }

  static cleanAllValues() {
    ConquerorSpy.provinceHistoryService.reset();
    ConquerorSpy.historyChecker.reset();
    ConquerorSpy.productionChecker.reset();
    ConquerorSpy.provinceOwnership.reset();
  }

  static refreshName() {
    const country = Globals.getCountry();
    if (country !== ConquerorSpy.lastCountry) {
      ConquerorSpy.lastCountry = country;
      ConquerorSpy.hud.refreshHudHistory(country);
    }
  }
}

ConquerorSpy.initialize();
ConquerorSpy.start();
