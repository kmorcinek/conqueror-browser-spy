import { Settings } from "../Settings";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { OneGameStatistics } from "./OneGameStatistics";

export class Winner {
  private readonly settings: Settings;
  private readonly provinceOwnership: IProvinceOwnership;

  constructor(settings: Settings, provinceOwnership: IProvinceOwnership) {
    this.settings = settings;
    this.provinceOwnership = provinceOwnership;
  }

  getStatistic(): OneGameStatistics {
    return new OneGameStatistics(this.isMyWin(), this.settings.getTurn());
  }

  private isMyWin(): boolean {
    const capital: string = this.settings.getMyCapital();
    return this.provinceOwnership.getOwnedProvinces().includes(capital);
  }
}
