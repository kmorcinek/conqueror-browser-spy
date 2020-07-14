import { Clicker } from "../Clicker";
import { Province } from "../Province";
import { Production } from "../Production";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { Culture } from "../Culture";
import { Attitude } from "../Attitude";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { BuyProduction } from "../BuyProduction";
import { GoldService } from "../GoldService";

export class ProvinceProductionAi {
  private clicker: Clicker;
  private goldService: GoldService;
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceHistoryService: ProvinceHistoryService;

  constructor(
    clicker: Clicker,
    goldService: GoldService,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.clicker = clicker;
    this.goldService = goldService;
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

  private getProductionGoal(province: Province): Production | BuyProduction | null {
    if (province.turn === 1) {
      return BuyProduction.of(Production.Soldier);
    }

    const hasNeighborOpponent: boolean = this.hasNeighborOpponent(province);
    if (hasNeighborOpponent) {
      return Production.Soldier;
    }

    if (province.attitude === Attitude.Rebellious || province.attitude === Attitude.Restless) {
      return Production.Diplomat;
    }

    const hasNeighborToConquer: boolean = this.hasNeighborToConquer(province);
    if (hasNeighborToConquer && province.culture !== Culture.Primitive) {
      return Production.Soldier;
    }

    if (province.soldiers < province.farms) {
      return Production.Soldier;
    }

    // TODO: Maybe remove this check as it is done without AI
    if (province.culture === Culture.Advanded) {
      if (
        (province.farms >= 6 && (province.resources === 0 || province.resources === 2)) ||
        province.farms >= 7
      ) {
        return Production.Gold;
      }
    }

    // Buy Culture if you can
    if (
      hasNeighborToConquer &&
      province.culture === Culture.Primitive &&
      province.farms >= 3 &&
      this.isEnoughGold(Production.Culture)
    ) {
      return BuyProduction.of(Production.Culture);
    }

    if (province.production !== Production.Farm && province.production !== Production.Culture) {
      return Production.Farm;
    }

    return null;
  }

  private isEnoughGold(production: Production) {
    if (production === Production.Culture) {
      // TODO: hardcoded 60
      return this.goldService.getCurrent() - 2 * this.goldService.getSupport() > 60;
    }

    return false;
  }

  private hasNeighborToConquer(province: Province): boolean {
    const conqueredProvinces = this.provinceOwnership.getOwnedProvinces();
    const neighbors = this.provinceNeighborhood.getNeighbors(province.name);
    return neighbors.filter(neighbor => conqueredProvinces.includes(neighbor) === false).length > 0;
  }

  private hasNeighborOpponent(province: Province): boolean {
    const neighbors = this.provinceNeighborhood.getNeighbors(province.name);
    const opponentNeighbors = this.provinceOwnership.filterOpponents(neighbors);
    return opponentNeighbors.length > 0;
  }
}
