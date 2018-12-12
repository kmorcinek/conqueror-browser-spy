// Get details of one province.
// - (without turn)
function getCountryDetails(countryName)
{
    function createId(prefix, province) {
        return prefix + province.toLowerCase();
    }

    // TODO: prefetch it
    var a = document.getElementsByClassName("svgMap")[0];
    var svgDoc = a.contentDocument;

    var populationItem = svgDoc.getElementById(createId("pop_", countryName));
    if (populationItem == null) {
        return null;
    }

    // fog of war
    if (populationItem.getAttribute("visibility") === "hidden") {
        return null;
    }

    var productionItem = svgDoc.getElementById(createId("prod_", countryName));
    var production = productionItem.getAttribute("xlink:href");
    var isHidden = productionItem.getAttribute("visibility") === "hidden";
    if (isHidden) {
        production = "";
    }

    var soldierItem = svgDoc.getElementById(createId("info_", countryName));

    var countryDetails = {
        turn: getTurn(),
        name: countryName,
        population: populationItem.textContent,
        culture: populationItem.className.animVal,
        production: production,
        soldiers: soldierItem.textContent
    };

    return countryDetails;
}

// TODO: animVal vs baseVal?
//svgItem.className.animVal

// #prod_crete
// < image id = "prod_crete" class="prod" height = "12" width = "12" x = "738.4375" y = "659" xlink:href = "../common/images/icon_unit.png" visibility = "inherit" transform = "translate(242.56000000000006,213.76)" />
// icon_farm.png, icon_unit.png, gold, culture, castle_kind, diplomat,

function updateProvinces() {
    for (var i = 0; i < provinces.length; i++) {
        var provinceName = provinces[i];

        if (conqueredProvinces.includes(provinceName)) {
            continue;
        }
        
        var province = getCountryDetails(provinceName);

        if (province == null) {
            continue;
        }

        provincesHistory[provinceName].push(province);

        checkHistory(provincesHistory[provinceName]);
    }

    // TODO: refactor alertsToShow
    if (alertsToShow.length) {
        alert(alertsToShow.join(", "));
        alertsToShow = [];
    }
}

var provincesHistory;

var alertsToShow = [];

function checkHistory(history) {
    // population 3 is longer than x (5?) => developing
    // -start from last one
    var last = history[history.length - 1];
    var lastSoldiersCount = last.soldiers;

    if (last.population === "3") {
        var counter = 0;
        for (var i = history.length - 2; i > -1; i--) {
            var current = history[i];
            if (current.population === "3" && lastSoldiersCount <= current.soldiers) {
                counter++;
            }
        }

        if (counter > 1) {
            alertsToShow.push(last.name + " is developing");
        }
    }
}

