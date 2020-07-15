import { Provinces } from "./Provinces";
import { ProvinceHistoryServiceInterface } from "./ProvinceHistoryServiceInterface";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { ColorPicker } from "./ColorPicker";
import { Settings } from "./Settings";

export class ProvinceOwnership implements IProvinceOwnership {
  private provinceHistoryService: ProvinceHistoryServiceInterface;
  private settings: Settings;

  private ownedProvinces: string[] = [];
  private opponentProvinces: string[] = [];
  private neutralProvinces: string[] = [];

  constructor(provinceHistoryService: ProvinceHistoryServiceInterface, settings: Settings) {
    this.provinceHistoryService = provinceHistoryService;
    this.settings = settings;
  }

  updateOwnedProvinces() {
    this.reset();

    const provinces = Provinces.getProvinces();
    for (const provinceName of provinces) {
      const color = ColorPicker.getColor(provinceName);

      // console.log(`Color: '${color}'`);
      const myColor = this.settings.getMyColor();

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

      if (color === myColor) {
        this.ownedProvinces.push(provinceName);
      } else if (playerColors.includes(color)) {
        this.opponentProvinces.push(provinceName);
      } else {
        this.neutralProvinces.push(provinceName);
      }
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
