import { Globals } from "./Globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { Production } from "./Production";
import { Provinces } from "./Provinces";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Attitude } from "./Attitude";
import { Clicker } from "./Clicker";
import { Fortification } from "./Fortification";

export class ProvinceParser {
  private provinceHistoryService: ProvinceHistoryService;
  private clicker: Clicker;

  constructor(provinceHistoryService: ProvinceHistoryService, clicker: Clicker) {
    this.provinceHistoryService = provinceHistoryService;
    this.clicker = clicker;
  }

  // TODO: animVal vs baseVal?
  // svgItem.className.animVal
  updateProvinces() {
    const provinces = Provinces.getProvinces();
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
  private getCountryDetails(provinceName: string): Province | null {
    function createId(prefix: string) {
      return prefix + provinceName.toLowerCase();
    }

    const mapDocument = Globals.getMapDocument();

    const populationItem = mapDocument.getElementById(createId("pop_"));
    if (populationItem === null) {
      return null;
    }

    // fog of war
    if (populationItem.getAttribute("visibility") === "hidden") {
      return null;
    }

    const culture = this.parseCulture((populationItem.className as any).animVal);

    const productionItem = mapDocument.getElementById(createId("prod_"));
    const productionString = productionItem!.getAttribute("xlink:href");
    let production: Production | null;
    let attitude: Attitude | null;
    const isHidden = productionItem!.getAttribute("visibility") === "hidden";
    if (isHidden) {
      production = null;
      attitude = null;
    } else {
      production = this.parseProduction(productionString!);
      const attitudeLabel = this.getAttitudeLabel(provinceName);
      attitude = this.parseAttitude(attitudeLabel!);
    }

    const soldierItem = mapDocument.getElementById(createId("info_"));

    const farmsWithResources = Province.parsePopulation(populationItem.textContent!);

    const province = new Province(
      Globals.getTurn(),
      provinceName,
      farmsWithResources.farms,
      farmsWithResources.resources,
      culture,
      production,
      parseInt(soldierItem!.textContent!),
      this.getFort(mapDocument, provinceName),
      attitude
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

  private parseProduction(longIcon: string): Production {
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

  private getAttitudeLabel(provinceName: string) {
    console.log("clicking when parsing:", provinceName);
    this.clicker.clickProvince(provinceName);
    return document.getElementsByClassName("fieldInfoAttitude ")[0].childNodes[0].textContent;
  }

  private parseAttitude(label: string): Attitude {
    label = label.replace(" to me", "");

    const attitudes = [
      Attitude.Rebellious,
      Attitude.Restless,
      Attitude.Content,
      Attitude.Supportive,
      Attitude.Devoted,
    ];

    for (const enumAttitude of attitudes) {
      if (enumAttitude.toLowerCase() === label) {
        return enumAttitude;
      }
    }

    const errorMessage = `Missing attitude label: '${label}'`;
    console.error(errorMessage);
    throw new DOMException(errorMessage);
  }

  private getFort(mapDocument: Document, provinceName: string): Fortification {
    function createFortId(prefix: string) {
      return prefix + provinceName.toLowerCase() + "_0";
    }

    const fortItem = mapDocument.getElementById(createFortId("fort_"));
    if (fortItem !== null) {
      return Fortification.Fort;
    } else {
      const keepItem = mapDocument.getElementById(createFortId("keep_"));

      if (keepItem !== null) {
        return Fortification.Keep;
      } else {
        return Fortification.Nothing;
      }
    }
  }
}
