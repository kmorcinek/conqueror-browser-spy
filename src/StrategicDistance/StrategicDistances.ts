import { ProvinceNeighborhood } from "../ProvinceNeighborhood";
import { EuropeMapProvinceNeighbourhoodProvider } from "../ProvinceNeighborhood/EuropeMapProvinceNeighborhoodProvider";
import { CapitalDistance } from "./CapitalDistance";
import { ProvinceClosestCapital } from "./ProvinceClosestCapital";
import { FakeMapValidator } from "./FakeMapValidator";
import { IProvinceNeighbourhoodProvider } from "../ProvinceNeighborhood/IProvinceNeighbourhoodProvider";

export class StrategicDistances {
  
  readonly myCapital: string;
  readonly opponentCapital: string;
  readonly distanceBetweenCapitals: number;
  readonly provinceNeighborhood: ProvinceNeighborhood;
  readonly neighbourhoodProvider: IProvinceNeighbourhoodProvider;

  constructor(myCapital: string, opponentCapital: string) {
    this.myCapital = myCapital;
    this.opponentCapital = opponentCapital;
    this.neighbourhoodProvider = new EuropeMapProvinceNeighbourhoodProvider();
    this.provinceNeighborhood = new ProvinceNeighborhood(
      [this.neighbourhoodProvider/*, new TinyMapProvinceNeighbourhoodProvider()*/],
      new FakeMapValidator(),
    );
    this.distanceBetweenCapitals = this.provinceNeighborhood.getDistance(myCapital, opponentCapital);
  }

  getProvincesBetweenCapitals(): string[] {
    const allProvinces = Object.keys(this.neighbourhoodProvider.getNeighborhood());
    return allProvinces.filter(
      province => this.isBetween(province),
    );
  }

  private isBetween(provinceName: string): boolean {
    const distanceToMyCapital = this.provinceNeighborhood.getDistance(this.myCapital, provinceName);

    const distanceToOpponent = this.provinceNeighborhood.getDistance(this.opponentCapital, provinceName);

    if (distanceToMyCapital + distanceToOpponent - 2 > this.distanceBetweenCapitals) {
      return false;
    }

    return Math.abs(distanceToMyCapital - distanceToOpponent) < 3;
  }

  getDistance(provinceName: string): CapitalDistance {
    const distanceToMyCapital = this.provinceNeighborhood.getDistance(this.myCapital, provinceName);

    const distanceToOpponent = this.provinceNeighborhood.getDistance(this.opponentCapital, provinceName);

    if (distanceToMyCapital < distanceToOpponent) {
      return new CapitalDistance(ProvinceClosestCapital.Me, distanceToMyCapital);
    }

    if (distanceToMyCapital == distanceToOpponent) {
      return new CapitalDistance(ProvinceClosestCapital.Both, distanceToMyCapital);
    }

    return new CapitalDistance(ProvinceClosestCapital.Opponent, distanceToOpponent);
  }
}
