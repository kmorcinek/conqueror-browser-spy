import { ProvinceHistory } from "./ProvinceHistory";

export interface ProvinceHistoryServiceInterface {
  getByName(provinceName: string): ProvinceHistory;
  reset(): void;
}
