import { Clicker } from "../Clicker";
import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { ProvinceNeighborhoods } from "../ProvinceNeighborhoods";
import { IProvinceOwnership } from "../IProvinceOwnership";
import { ProvinceHistoryService } from "../ProvinceHistoryService";
import { Province } from "../Province";
import { Attitude } from "../Attitude";

export class ArmyMoverAi {
  static attackingSoldiersCount(source: Province, remainingSoldiers: number, target: Province) {
    const soldiersToStay = ArmyMoverAi.getNumberOfSoldiersToStay(source);
    const soldiersReadyToAttack = Math.max(remainingSoldiers - soldiersToStay, 0);
    return Math.min(soldiersReadyToAttack, target.soldiers + 2);
  }

  private static getNumberOfSoldiersToStay(source: Province): number {
    switch (source.attitude) {
      case Attitude.Rebellious:
      case Attitude.Restless:
        return 2;
      case Attitude.Content:
        return 1;
      case Attitude.Supportive:
      case Attitude.Devoted:
        return 0;
      default:
        console.error("Missing Attitude");
        throw new Error("Missing Attitude");
    }
  }

  private clicker: Clicker;
  private provinceOwnership: IProvinceOwnership;
  private provinceNeighborhood: ProvinceNeighborhood;
  private provinceNeighborhoods: ProvinceNeighborhoods;
  private provinceHistoryService: ProvinceHistoryService;

  constructor(
    clicker: Clicker,
    provinceOwnership: IProvinceOwnership,
    provinceNeighborhood: ProvinceNeighborhood,
    provinceNeighborhoods: ProvinceNeighborhoods,
    provinceHistoryService: ProvinceHistoryService
  ) {
    this.clicker = clicker;
    this.provinceOwnership = provinceOwnership;
    this.provinceNeighborhood = provinceNeighborhood;
    this.provinceNeighborhoods = provinceNeighborhoods;
    this.provinceHistoryService = provinceHistoryService;
  }

  moveArmies() {
    const ownedProvinces = this.provinceOwnership.getOwnedProvinces();
    for (const ownedProvince of ownedProvinces) {
      this.moveArmy(ownedProvince);
    }
  }

  private moveArmy(sourceProvinceName: string) {
    console.log("trying to move army from " + sourceProvinceName);
    const ownedProvince = this.provinceOwnership.getOwnedProvinces();

    const sourceProvince = this.provinceHistoryService.getByName(sourceProvinceName).getLast();
    let remainingSoldiers = sourceProvince.soldiers;
    const neighbors = this.provinceNeighborhood.getNeighbors(sourceProvinceName);
    const notOwnedNeighbors = this.provinceOwnership.getNotOwned(neighbors);
    if (notOwnedNeighbors.length > 0) {
      for (const neighbor of notOwnedNeighbors) {
        console.log("trying to move army to      " + neighbor);

        const target = this.provinceHistoryService.getByName(neighbor).getLast();
        const attackingSoldiersCount = ArmyMoverAi.attackingSoldiersCount(
          sourceProvince,
          remainingSoldiers,
          target
        );
        console.log(
          `Attacking ${attackingSoldiersCount} soldiers from ${sourceProvinceName} to ${target.name}`
        );
        if (attackingSoldiersCount > 2) {
          const decrementArmySize = remainingSoldiers - attackingSoldiersCount;
          this.clicker.moveArmy(sourceProvinceName, neighbor, decrementArmySize);
          remainingSoldiers -= attackingSoldiersCount;
        }
        if (attackingSoldiersCount > 0) {
          const decrementArmySize = remainingSoldiers - attackingSoldiersCount;
          this.clicker.moveArmy(sourceProvinceName, neighbor, decrementArmySize);
          remainingSoldiers -= attackingSoldiersCount;
        }
      }
    } else {
      console.log("neighbors conquered. Moving armies");
      const closeEnemiesOrNeutral = this.provinceNeighborhoods.getCloseNotCounqueredNeighbors(
        sourceProvinceName
      );
      console.log("Number of closeEnemiesOrNeutral:", closeEnemiesOrNeutral.length);
      const targetProvince = closeEnemiesOrNeutral[0];
      console.log("Closest target:", targetProvince);
      const toStay = ArmyMoverAi.getNumberOfSoldiersToStay(sourceProvince);
      // TODO: UT for that
      const path = this.provinceNeighborhood.getPath(sourceProvince.name, targetProvince);
      this.clicker.moveArmy(sourceProvinceName, path[0], toStay);
    }
  }
}
