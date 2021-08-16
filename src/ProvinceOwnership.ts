import { Provinces } from "./Provinces";
import { ProvinceHistoryServiceInterface } from "./ProvinceHistoryServiceInterface";
import { IProvinceOwnership } from "./IProvinceOwnership";
import { ColorPicker } from "./ColorPicker";
import { Settings } from "./Settings";
import { IProvinceMapValidator } from "./ProvinceNeighborhood/IProvinceMapValidator";

export class ProvinceOwnership implements IProvinceOwnership {
  private readonly provinceHistoryService: ProvinceHistoryServiceInterface;
  private readonly provinceMapValidator: IProvinceMapValidator;
  private readonly settings: Settings;

  private ownedProvinces: string[] = [];
  private opponentProvinces: string[] = [];
  private neutralProvinces: string[] = [];

  constructor(
    provinceHistoryService: ProvinceHistoryServiceInterface,
    provinceMapValidator: IProvinceMapValidator,
    settings: Settings
  ) {
    this.provinceHistoryService = provinceHistoryService;
    this.provinceMapValidator = provinceMapValidator;
    this.settings = settings;
  }

  updateOwnedProvinces() {
    this.reset();

    // TODO: now are two ways of taking provinces to deal with
    const provinces = Provinces.getProvinces();
    for (const provinceName of provinces) {
      if (!this.provinceMapValidator.exists(provinceName)) {
        continue;
      }
      const provinceColor = ColorPicker.getColor(provinceName);
      console.log(`Province: ${provinceName}, Color: '${provinceColor}'`);
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

      if (provinceColor === myColor) {
        console.log(`pushing Province: ${provinceName}, as mine`);
        this.ownedProvinces.push(provinceName);
      } else if (playerColors.includes(provinceColor)) {
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

  getAllProvinces() {
    return this.ownedProvinces.concat(this.opponentProvinces).concat(this.neutralProvinces);
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
