import { Greeter } from "./Globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { Production } from "./Production";
import { Provinces } from "./Provinces";
import { ProvinceHistoryService } from "./ProvinceHistoryService";

export class ProvinceParser {
  private provinceHistoryService: ProvinceHistoryService;

  constructor(provinceHistoryService: ProvinceHistoryService) {
    this.provinceHistoryService = provinceHistoryService;
  }

  // TODO: animVal vs baseVal?
  // svgItem.className.animVal
  updateProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      const province = this.getCountryDetails(provinceName);

      if (province === null) {
        continue;
      }

      this.provinceHistoryService.getByName(provinceName).add(province);
    }
  }

  // Get details of one province.
  // - (without turn)
  private getCountryDetails(countryName: string): Province | null {
    function createId(prefix: string, provinceName: string) {
      return prefix + provinceName.toLowerCase();
    }

    // TODO: prefetch it
    const a = document.getElementsByClassName("svgMap")[0];
    const svgDoc = (a as any).contentDocument;

    const populationItem = svgDoc.getElementById(createId("pop_", countryName));
    if (populationItem === null) {
      return null;
    }

    // fog of war
    if (populationItem.getAttribute("visibility") === "hidden") {
      return null;
    }

    const culture = this.parseCulture(populationItem.className.animVal);

    function parseProduction(longIcon: string): Production {
      const icon = longIcon.replace("../common/images/icon_", "").replace(".png", "");

      switch (icon) {
        case "unit":
          return Production.Soldier;
        case "gold":
          return Production.Gold;
        case "farm":
          return Production.Farm;
        case "culture":
          return Production.Culture;
        case "castle_kind":
          return Production.Fort;
        case "diplomat":
          return Production.Diplomat;
        default:
          const errorMessage = "new Production value: " + icon;
          console.error(errorMessage);
          throw new DOMException(errorMessage);
      }
    }

    const productionItem = svgDoc.getElementById(createId("prod_", countryName));
    const productionString = productionItem.getAttribute("xlink:href");
    let production: Production | null;
    const isHidden = productionItem.getAttribute("visibility") === "hidden";
    if (isHidden) {
      production = null;
    } else {
      production = parseProduction(productionString);
    }

    const soldierItem = svgDoc.getElementById(createId("info_", countryName));

    const farmsWithResources = Province.parsePopulation(populationItem.textContent);

    const province = new Province(
      Greeter.getTurn(),
      countryName,
      farmsWithResources.farms,
      farmsWithResources.resources,
      culture,
      production,
      parseInt(soldierItem.textContent),
      this.getFort(svgDoc, countryName)
    );

    // console.log("province parsed:", countryName);

    return province;
  }

  private parseCulture(str: string): Culture {
    switch (str) {
      case "":
        return Culture.Primitive;
      case "dev":
        return Culture.Developed;
      case "adv":
        return Culture.Advanded;
      default:
        console.warn("new Culture value: " + str);
        return Culture.Advanded;
    }
  }

  private getFort(svgDoc: any, countryName: string) {
    function createFortId(prefix: string, province: string) {
      return prefix + province.toLowerCase() + "_0";
    }

    const fortItem = svgDoc.getElementById(createFortId("fort_", countryName));
    if (fortItem !== null) {
      return "fort";
    } else {
      const keepItem = svgDoc.getElementById(createFortId("keep_", countryName));

      if (keepItem !== null) {
        return "keep";
      } else {
        return "";
      }
    }
  }
}
