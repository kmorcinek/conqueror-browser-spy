import { Globals } from "./Globals";
import { Province } from "./Province";
import { Culture } from "./Culture";
import { Production } from "./Production";
import { Provinces } from "./Provinces";
import { ProvinceHistoryService } from "./ProvinceHistoryService";
import { Attitude } from "./Attitude";
import { Clicker } from "./Clicker";
import { Fortification } from "./Fortification";
import { MapUtils } from "./MapUtils";

export class ProvinceParser {
  private readonly provinceHistoryService: ProvinceHistoryService;
  private readonly clicker: Clicker;

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
      return MapUtils.createId(prefix, provinceName);
    }

    const mapDocument = Globals.getMapDocument();

    const populationItem = mapDocument.getElementById(createId("pop_"));
    if (populationItem === null) {
      return null;
    }

    // fog of war
    if (this.isHidden(populationItem)) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const culture = this.parseCulture((populationItem.className as any).animVal);

    const productionItem = mapDocument.getElementById(createId("prod_")) as HTMLElement;
    const productionString = productionItem.getAttribute("xlink:href") as string;
    let production: Production | null;
    let attitude: Attitude | null;
    const farmsWithResources = Province.parsePopulation(populationItem.textContent as string);

    const isOwnedByMe = this.isHidden(productionItem) === false;
    if (isOwnedByMe) {
      console.log("Clicking when parsing:", provinceName);
      this.clicker.clickProvince(provinceName);

      const farmsLabel = this.getFarmsLabel();
      farmsWithResources.farms = parseInt(farmsLabel);

      production = this.parseProduction(productionString);

      const attitudeLabel = this.getAttitudeLabel();
      attitude = this.parseAttitude(attitudeLabel);
    } else {
      production = null;
      attitude = null;
    }

    const soldierItem = mapDocument.getElementById(createId("info_")) as HTMLElement;

    const province = new Province(
      Globals.getTurn(),
      provinceName,
      farmsWithResources.farms,
      farmsWithResources.resources,
      culture,
      production,
      parseInt(soldierItem.textContent as string),
      this.parseFort(mapDocument, provinceName),
      attitude,
    );

    // console.log("province parsed:", countryName);

    return province;
  }

  private isHidden(htmlElement: HTMLElement) {
    return htmlElement.getAttribute("visibility") === "hidden";
  }

  private parseCulture(str: string): Culture {
    switch (str) {
      case "":
        return Culture.Primitive;
      case "dev":
        return Culture.Developed;
      case "adv":
        return Culture.Advanced;
      default:
        console.warn("new Culture value: " + str);
        return Culture.Advanced;
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
      default: {
        const errorMessage = "new Production value: " + icon;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    }
  }

  private getFarmsLabel(): string {
    return document.getElementsByClassName("fieldInfoMain ")[0].childNodes[0].textContent as string;
  }

  private getAttitudeLabel(): string {
    return document.getElementsByClassName("fieldInfoAttitude ")[0].childNodes[0].textContent as string;
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
    throw new Error(errorMessage);
  }

  private parseFort(mapDocument: Document, provinceName: string): Fortification {
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
