import { Provinces } from "./Provinces";
import { ProvinceHistoryServiceInterface } from "./ProvinceHistoryServiceInterface";
import { Globals } from "./Globals";
import { IProvinceOwnership } from "./IProvinceOwnership";

export class ProvinceOwnership implements IProvinceOwnership {
  // conqueredProvinces was removed cause after loosing a province it cannot be attacked again.
  // private conqueredProvinces: string[] = [];
  private ownedProvinces: string[] = [];
  private opponentProvinces: string[] = [];
  private neutralProvinces: string[] = [];
  private provinceHistoryService: ProvinceHistoryServiceInterface;

  constructor(provinceHistoryService: ProvinceHistoryServiceInterface) {
    this.provinceHistoryService = provinceHistoryService;
  }

  updateOwnedProvinces() {
    this.reset();
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
    }

    const provinces = Provinces.getProvinces();
    for (const provinceName of provinces) {
      // if (this.conqueredProvinces.includes(provinceName)) {
      //   continue;
      // }

      const mapDocument = Globals.getMapDocument();

      const map = mapDocument.getElementById(createId("field_", provinceName));

      if (map == null) {
        continue;
      }

      const color = map.getAttribute("fill")!;

      console.log(`Color: '${color}'`);
      const opponentColor = "#ff3131";
      const myColor = "#009c00";

      if (color === myColor) {
        this.ownedProvinces.push(provinceName);
      } else if (color === opponentColor) {
        this.opponentProvinces.push(provinceName);
      } else {
        this.neutralProvinces.push(provinceName);
      }
      const playerColors = [
        "#ff3131",
        "#009c00",
        "#3131ff",
        "#ffce00",
        "#636300",
        "#63319c",
        "#ce63ce",
        "#ce9c63",
        "#006363",
        "#319c9c",
      ];

      // if (playerColors.includes(color)) {
      //   this.conqueredProvinces.push(provinceName);
      //   console.log("conquered: ", provinceName);
      // }
    }
  }

  getConqueredProvinces() {
    return this.ownedProvinces.concat(this.opponentProvinces);
  }

  getOwnedProvinces() {
    return this.ownedProvinces;
  }

  getOpponentProvinces() {
    return this.opponentProvinces;
  }

  getNeutralProvinces() {
    return this.neutralProvinces;
  }

  // getOwned(provinces: string[]) {
  //   return provinces.filter(provinceName => this.isOwned(provinceName));
  // }

  getNotOwned(provinces: string[]) {
    return provinces.filter(provinceName => this.isOwned(provinceName) === false);
  }

  filterOpponents(provinces: string[]): string[] {
    return provinces.filter(name => this.opponentProvinces.includes(name));
  }

  filterNeutral(provinces: string[]): string[] {
    return provinces.filter(name => this.neutralProvinces.includes(name));
  }

  private isOwned(province: string) {
    return this.provinceHistoryService.getByName(province).getLast().production !== null;
  }

  // tslint:disable-next-line: member-ordering
  reset() {
    this.ownedProvinces.splice(0, this.ownedProvinces.length);
    this.opponentProvinces.splice(0, this.opponentProvinces.length);
    this.neutralProvinces.splice(0, this.neutralProvinces.length);
  }
}
