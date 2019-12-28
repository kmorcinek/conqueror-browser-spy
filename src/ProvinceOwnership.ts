import { Provinces } from "./Provinces";
import { ProvinceHistoryServiceInterface } from "./ProvinceHistoryServiceInterface";
import { Greeter } from "./Globals";
import { IProvinceOwnership } from "./IProvinceOwnership";

export class ProvinceOwnership implements IProvinceOwnership {
  private conqueredProvinces: string[] = [];
  private provinceHistoryService: ProvinceHistoryServiceInterface;

  constructor(provinceHistoryService: ProvinceHistoryServiceInterface) {
    this.provinceHistoryService = provinceHistoryService;
  }

  updateOwnedProvinces() {
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
    }

    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      if (this.conqueredProvinces.includes(provinceName)) {
        continue;
      }

      const mapDocument = Greeter.getMapDocument();

      const map = mapDocument.getElementById(createId("field_", provinceName));

      if (map == null) {
        continue;
      }

      const color = map.getAttribute("fill")!;

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

      if (playerColors.includes(color)) {
        this.conqueredProvinces.push(provinceName);
        console.log("conquered: ", provinceName);
      }
    }
  }

  getConqueredProvinces() {
    return this.conqueredProvinces;
  }

  getOwnedProvinces() {
    return this.conqueredProvinces.filter(
      provinceName =>
        this.provinceHistoryService.getByName(provinceName).getLast().production !== null
    );
  }

  reset() {
    this.conqueredProvinces = [];
  }
}
