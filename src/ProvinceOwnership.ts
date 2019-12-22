import { Provinces } from "./Provinces";
import { ProvinceHistoryService } from "./ProvinceHistoryService";

export class ProvinceOwnership {
  private conqueredProvinces: string[] = [];
  private provinceHistoryService: ProvinceHistoryService;

  constructor(provinceHistoryService: ProvinceHistoryService) {
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

      // TODO: prefetch it
      const a = document.getElementsByClassName("svgMap")[0];
      const svgDoc = (a as any).contentDocument;

      const map = svgDoc.getElementById(createId("field_", provinceName));

      if (map == null) {
        continue;
      }

      const color = map.getAttribute("fill");

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
