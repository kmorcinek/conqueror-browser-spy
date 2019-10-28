import { Greeter } from "./globals";
import { Provinces } from "./provinces";

export class ProvinceParser {

    // Get details of one province.
    // - (without turn)
    getCountryDetails(countryName: string) {
        function createId(prefix: string, province: string) {
            return prefix + province.toLowerCase();
        }

        // TODO: prefetch it
        let a = document.getElementsByClassName("svgMap")[0];
        var svgDoc = (a as any).contentDocument;

        var populationItem = svgDoc.getElementById(createId("pop_", countryName));
        if (populationItem === null) {
            return null;
        }

        // fog of war
        if (populationItem.getAttribute("visibility") === "hidden") {
            return null;
        }

        var culture = populationItem.className.animVal;
        if (culture === "") {
            culture = 'pri';
        }

        function parseProduction(icon: string) {
            var production = icon.replace("../common/images/icon_", "").replace(".png", "");
            if (production === "castle_kind") {
                production = "fort";
            }

            // possible values: {
            // "",
            // }
            return production;
        }

        var productionItem = svgDoc.getElementById(createId("prod_", countryName));
        var production = productionItem.getAttribute("xlink:href");
        var isHidden = productionItem.getAttribute("visibility") === "hidden";
        if (isHidden) {
            production = "";
        } else {
            production = parseProduction(production)
        }

        var soldierItem = svgDoc.getElementById(createId("info_", countryName));

        var countryDetails = {
            turn: Greeter.getTurn(),
            name: countryName,
            population: populationItem.textContent,
            culture: culture,
            production: production,
            soldiers: soldierItem.textContent,
            fort: this.getFort(svgDoc, countryName)
        };

        console.log('province parsed:', countryName);

        return countryDetails;
    }

    getFort(svgDoc: any, countryName: string) {
        function createFortId(prefix: string, province: string) {
            return prefix + province.toLowerCase() + "_0";
        }

        var fortItem = svgDoc.getElementById(createFortId("fort_", countryName));
        if (fortItem !== null) {
            return "fort";
        } else {
            var keepItem = svgDoc.getElementById(createFortId("keep_", countryName));

            if (keepItem !== null) {
                return "keep";
            } else {
                return "";
            }
        }
    }

    // TODO: animVal vs baseVal?
    //svgItem.className.animVal

    // #prod_crete
    // < image id = "prod_crete" class="prod" height = "12" width = "12" x = "738.4375" y = "659" xlink:href = "../common/images/icon_unit.png" visibility = "inherit" transform = "translate(242.56000000000006,213.76)" />
    // icon_farm.png, icon_unit.png, gold, culture, castle_kind, diplomat,

    public updateProvinces() {
        let provinces = Provinces.GetProvinces();
        for (var i = 0; i < provinces.length; i++) {
            let provinceName: string = provinces[i];

            var province = this.getCountryDetails(provinceName);

            if (province === null) {
                continue;
            }

            Greeter.provincesHistory[provinceName].push(province);
        }
    }
}
