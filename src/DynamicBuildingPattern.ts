import { BuildingPattern } from "./BuildingPattern";
import { Season } from "./Season";

export interface DynamicBuildingPattern extends BuildingPattern {
  // farms: number;
  // resources?: number;
  // assume always Advanced Culture
  // production: Production;
  // changeTo: Production;
  season: Season;
}
