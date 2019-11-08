import { Provinces } from "./provinces";

export class ProvinceOwnership {
  private conqueredProvinces: string[] = [];

  updateOwnedProvinces() {
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
    }

    const provinces = Provinces.GetProvinces();
    for (let i = 0; i < provinces.length; i++) {
      const provinceName: string = provinces[i];

      if ((this.conqueredProvinces as any).includes(provinceName)) {
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

      if ((playerColors as any).includes(color)) {
        this.conqueredProvinces.push(provinceName);
        console.log("conquered: ", provinceName);
      }
    }
  }

  getConqueredProvinces() {
    return this.conqueredProvinces;
  }

  reset() {
    this.conqueredProvinces = [];
  }
}
