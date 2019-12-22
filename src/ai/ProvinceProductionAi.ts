import { Clicker } from "../Clicker";
import { Province } from "../Province";
import { Production } from "../Production";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { IProvinceOwnership } from "../IProvinceOwnership";

export class ProvinceProductionAi {
  private clicker: Clicker;
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceHistoryService: ProvinceHistoryService;

  constructor(
    clicker: Clicker,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.clicker = clicker;
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
    this.provinceHistoryService = provinceHistoryService;
  }

  updateAllProvinces() {
    const conqueredProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const conqueredProvince of conqueredProvinces) {
      const original = this.provinceHistoryService.getByName(conqueredProvince).getLast();
      this.updateProduction(original);
    }
  }

  updateProduction(province: Province) {
    const productionGoal = this.getProductionGoal(province);
    if (productionGoal !== null) {
      this.clicker.changeProvinceProduction(province.name, productionGoal);
    }
  }

  private getProductionGoal(province: Province): Production | null {
    if (province.attitude === Attitude.Rebellious || province.attitude === Attitude.Restless) {
      return Production.Diplomat;
    }

    const hasNeighborToConquer: boolean = this.hasNeighborToConquer(province);
    if (hasNeighborToConquer && province.culture !== Culture.Primitive) {
      return Production.Soldier;
    }

    if (province.production !== Production.Farm && province.production !== Production.Culture) {
      return Production.Farm;
    }

    return null;
  }

  private hasNeighborToConquer(province: Province): boolean {
    const conqueredProvinces = this.provinceOwnership.getOwnedProvinces();
    const neighbors = this.provinceNeighborhood.getNeighbors(province.name);
    return neighbors.filter(neighbor => conqueredProvinces.includes(neighbor) === false).length > 0;
  }
}
