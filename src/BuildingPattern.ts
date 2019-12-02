import { Production } from "./Production";
import { Culture } from "./Culture";

export interface BuildingPattern {
  farms: number;
  resources?: number;
  culture?: Culture;
  production: Production;
}
