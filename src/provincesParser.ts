import { Greeter } from "./globals";
import { Provinces } from "./provinces";

export class ProvinceParser {
  // TODO: animVal vs baseVal?
  // svgItem.className.animVal

  // #prod_crete
  // < image id = "prod_crete" class="prod" height = "12" width = "12" x = "738.4375" y = "659" xlink:href = "../common/images/icon_unit.png" visibility = "inherit" transform = "translate(242.56000000000006,213.76)" />
  // icon_farm.png, icon_unit.png, gold, culture, castle_kind, diplomat,

  updateProvinces() {
    const provinces = Provinces.GetProvinces();
    for (const provinceName of provinces) {
      const province = this.getCountryDetails(provinceName);

      if (province === null) {
        continue;
      }

      Greeter.provincesHistory[provinceName].push(province);
    }
  }

  // Get details of one province.
  // - (without turn)
  private getCountryDetails(countryName: string) {
    function createId(prefix: string, province: string) {
      return prefix + province.toLowerCase();
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

    let culture = populationItem.className.animVal;
    if (culture === "") {
      culture = "pri";
    }

    function parseProduction(icon: string) {
      let parsedProduction = icon.replace("../common/images/icon_", "").replace(".png", "");
      if (parsedProduction === "castle_kind") {
        parsedProduction = "fort";
      }

      // possible values: {
      // "",
      // }
      return parsedProduction;
    }

    const productionItem = svgDoc.getElementById(createId("prod_", countryName));
    let production = productionItem.getAttribute("xlink:href");
    const isHidden = productionItem.getAttribute("visibility") === "hidden";
    if (isHidden) {
      production = "";
    } else {
      production = parseProduction(production);
    }

    const soldierItem = svgDoc.getElementById(createId("info_", countryName));

    const countryDetails = {
      turn: Greeter.getTurn(),
      name: countryName,
      population: populationItem.textContent,
      culture,
      production,
      soldiers: soldierItem.textContent,
      fort: this.getFort(svgDoc, countryName),
    };

    console.log("province parsed:", countryName);

    return countryDetails;
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
