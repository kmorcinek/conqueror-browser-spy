if (!window.jQuery || confirm('Overwrite\x20current\x20version?\x20v' + jQuery.fn.jquery)) (function (d, s) { s = d.createElement('script'); s.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js'; (d.head || d.documentElement).appendChild(s) })(document);
// - check

var turnSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount';

function getTurn() {
    return parseInt($(turnSelector).text().substring(5));
}

// Get details of one province.
// - (without turn)
function getCountryDetails(countryName)
{
    var a = document.getElementsByClassName("svgMap")[0];
    // Get the SVG document inside the Object tag
    var svgDoc = a.contentDocument;

    var populationId = "pop_" + countryName.toLowerCase();
    var populationItem = svgDoc.getElementById(populationId);
    
    var productionId = "prod_" + countryName.toLowerCase();
    var productionItem = svgDoc.getElementById(productionId);
    var production = productionItem.getAttribute("xlink:href");
    var isHidden = productionItem.getAttribute("visibility") === "hidden";
    if (isHidden) {
        production = "";
    }

    var countryDetails = {
        country: countryName,
        population: populationItem.textContent,
        culture: populationItem.className.animVal,
        production: production
    };

    console.log(populationItem);

    return countryDetails;
}

var poland = getCountryDetails('poland');
poland

// TODO: animVal vs baseVal?
//svgItem.className.animVal

// #prod_crete
// < image id = "prod_crete" class="prod" height = "12" width = "12" x = "738.4375" y = "659" xlink:href = "../common/images/icon_unit.png" visibility = "inherit" transform = "translate(242.56000000000006,213.76)" />
// icon_farm.png, icon_unit.png, gold, culture, castle_kind, diplomat,

var lastTurn = 0;

function refreshTurn() {
    var turn = getTurn();
    if (turn !== lastTurn) {
        lastTurn = turn;
        console.log("New turn: ", lastTurn);
        updateProvinces();
    }
}

var refrestTurnInterval;
clearInterval(refrestTurnInterval);
refrestTurnInterval = setInterval(refreshTurn, 500);

function updateProvinces() {
    var provinceName = 'Livonia';

    var province = getCountryDetails(provinceName);

    console.log("Province:", province);

    livoniaHistory.push(province);

    checkHistory(livoniaHistory);
}

var livoniaHistory = [];

function checkHistory(history) {
    // population 3 is longer than x (5?) => developing
    // -start from last one
    var last = history[history.length - 1];
    if (last.population === "3") {
        var counter = 0;
        for (var i = history.length - 2; i > -1; i--) {
            if (history[i].population === "3") {
                counter++;
            } 
        }

        if (counter > 1) {
            alert("livonia is developing");
        }
    }
}
