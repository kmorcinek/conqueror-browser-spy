import { AiManager } from "./ai/AiManager";
import { ArmyMarcher } from "./ai/ArmyMarcher";
import { ArmyMoverAi } from "./ai/ArmyMoverAi";
import { ArmyMovesRecorder } from "./ai/ArmyMovesRecorder";
import { BacklandProductionAi } from "./ai/backland/BacklandProductionAi";
import { Backlands } from "./ai/backland/Backlands";
import { BattleProvinceNeighborhoods } from "./ai/BattleProvinceNeighborhoods";
import { NeutralAttacker } from "./ai/NeutralAttacker";
import { OpponentAttacker } from "./ai/OpponentAttacker";
import { ProvinceProductionAi } from "./ai/ProvinceProductionAi";
import { BrowserHtmlDocument } from "./BrowserHtmlDocument";
import { BuildingChanger } from "./BuildingChanger";
import { CapitalFinder } from "./CapitalFinder";
import { Clicker } from "./Clicker";
import { DynamicProductionChecker } from "./DynamicProductionChecker";
import { FarmHistoryChecker } from "./FarmHistoryChecker";
import { GameRestarter } from "./GameRestarter";
import { GoldService } from "./GoldService";
import { HistoryChecker } from "./HistoryChecker";
import { Hud } from "./Hud";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { ProductionChecker } from "./ProductionChecker";
import { ProductionWarningsHud } from "./ProductionWarningsHud";
import { ProvinceHistoryChecker } from "./ProvinceHistoryChecker";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { ProvinceNeighborhood } from "./ProvinceNeighborhood";
import { EuropeMapProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/EuropeMapProvinceNeighborhoodProvider";
import { ProvinceMapValidator } from "./ProvinceNeighborhood/ProvinceMapValidator";
import { TinyMapProvinceNeighbourhoodProvider } from "./ProvinceNeighborhood/TinyMapProvinceNeighbourhoodProvider";
import { ProvinceNeighborhoods } from "./ProvinceNeighborhoods";
import { ProvinceOwnership } from "./ProvinceOwnership";
import { ProvinceParser } from "./ProvincesParser";
import { Settings } from "./Settings";
import { StaticProductionChecker } from "./StaticProductionChecker";
import { Statistics } from "./statistics/Statistics";
import { Winner } from "./statistics/Winner";

export interface AppContainer {
  settings: Settings;
  goldService: GoldService;
  provinceHistoryService: ProvinceHistoryService;
  provinceParser: ProvinceParser;
  provinceOwnership: IProvinceOwnership;
  provinceNeighborhood: ProvinceNeighborhood;
  productionChecker: ProductionChecker;
  historyChecker: HistoryChecker;
  hud: Hud;
  aiManager: AiManager;
  gameRestarter: GameRestarter;
}

export function createContainer(clicker: Clicker, provinceMapValidator: ProvinceMapValidator): AppContainer {
  const goldService = new GoldService();
  const capitalFinder = new CapitalFinder(new BrowserHtmlDocument());
  const settings = new Settings(capitalFinder);
  const productionWarningsHud = new ProductionWarningsHud();
  const provinceHistoryService = new ProvinceHistoryService();
  const provinceNeighborhood = new ProvinceNeighborhood(
    [new EuropeMapProvinceNeighbourhoodProvider(), new TinyMapProvinceNeighbourhoodProvider()],
    provinceMapValidator,
  );
  const provinceParser = new ProvinceParser(provinceHistoryService, clicker);
  const provinceOwnership: IProvinceOwnership = new ProvinceOwnership(
    provinceHistoryService,
    provinceMapValidator,
    settings,
  );
  const provinceNeighborhoods = new ProvinceNeighborhoods(provinceOwnership, provinceNeighborhood);
  const buildingChanger = new BuildingChanger(clicker);
  const productionChecker = new ProductionChecker(
    provinceOwnership,
    provinceHistoryService,
    productionWarningsHud,
    new StaticProductionChecker(),
    new DynamicProductionChecker(),
    buildingChanger,
  );
  const historyChecker = new HistoryChecker(
    provinceOwnership,
    new ProvinceHistoryChecker(),
    new FarmHistoryChecker(),
    provinceHistoryService,
  );
  const hud = new Hud(provinceOwnership, historyChecker, provinceHistoryService);
  const battleProvinceNeighborhoods = new BattleProvinceNeighborhoods(
    settings,
    provinceOwnership,
    provinceNeighborhood,
    provinceNeighborhoods,
    provinceHistoryService,
  );
  const backlands = new Backlands(battleProvinceNeighborhoods);
  const backlandProductionAi = new BacklandProductionAi(goldService, settings);
  const provinceProductionAi = new ProvinceProductionAi(
    clicker,
    battleProvinceNeighborhoods,
    backlands,
    backlandProductionAi,
    goldService,
  );
  const armyMovesRecorder = new ArmyMovesRecorder();
  const armyMoverAi = new ArmyMoverAi(
    clicker,
    battleProvinceNeighborhoods,
    new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder),
    new OpponentAttacker(armyMovesRecorder),
    new NeutralAttacker(armyMovesRecorder),
    armyMovesRecorder,
  );
  const aiManager = new AiManager(battleProvinceNeighborhoods, backlands, armyMoverAi, provinceProductionAi);
  const gameRestarter = new GameRestarter(new Statistics(), new Winner(settings, provinceOwnership));

  return {
    settings,
    goldService,
    provinceHistoryService,
    provinceParser,
    provinceOwnership,
    provinceNeighborhood,
    productionChecker,
    historyChecker,
    hud,
    aiManager,
    gameRestarter,
  };
}
