var turnSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount';

function getTurn() {
    return parseInt($(turnSelector).text().substring(5));
}

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

var lastTurn = NaN;

function refreshTurn() {
    var turn = getTurn();

    if (isNaN(turn)) {
        return;
    }

    if (turn !== lastTurn) {
        if (turn === 1) {
            cleanAllValues();
        }

        lastTurn = turn;
        console.log("New turn: ", lastTurn);
        updateProvinces();
        updateOwnedProvinces();
    }
}

function cleanAllValues() {
    lastCountry = "";
    conqueredProvinces = [];

    provincesHistory = {};

    for (var i = 0; i < provinces.length; i++) {
        var provinceName = provinces[i];
        provincesHistory[provinceName] = [];
    }
}

cleanAllValues();

var refrestTurnInterval;
clearInterval(refrestTurnInterval);
refrestTurnInterval = setInterval(refreshTurn, 500);

var allProvinces = [
    "eire", "ulster", "scotland", "wales", "northumberland", "england", "norway", "sweden", "finland", "denmark",
    "livonia", "muscovy", "ukraine", "crimea", "lithuania", "podolia", "prussia", "poland", "moldavia", "wallachia",
    "transylvania", "hungary", "serbia", "bulgaria", "dalmatia", "byzantium", "macedonia", "greece", "crete", "nicaea",
    "natolia", "syria", "palestine", "cyprus", "egypt", "cyrenaica", "tripoli", "tunis", "sicilia", "napoli", "roma",
    "sardinia", "corsica", "algiers", "tangiers", "morocco", "grenada", "portugal", "leon", "aragon", "castile",
    "gascony", "brittany", "aquitaine", "provence", "iledefrance", "normandy", "burgundy", "flanders", "holland",
    "luxembourg", "genoa", "venetia", "helvetica", "austria", "rhineland", "bohemia", "saxony", "hanover", "brandenburg"
];

var provinces = ["livonia", "muscovy", "ukraine", "crimea", "lithuania", "podolia", "prussia", "poland", "moldavia", "wallachia",
    "transylvania", "hungary", "serbia", "bulgaria", "dalmatia"];

provinces = allProvinces;

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
}

var provincesHistory;

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

        if (counter > 4) {
            alert(last.name + " is developing");
        }
    }
}

var timerWrapperSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnTimer';

var timerWrapper = $(timerWrapperSelector);

var hud = $('<div id="hud" style="margin-top: 20px;"></div>');
timerWrapper.append(hud);

function updateHud(text) {
    $('#hud').text(text)
}

function updateHudHtml(html) {
    $('#hud').html(html)
}

var countrySelector = '#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0.type_default > div > div.fieldHeaderWrapper > div.fieldHeader > span'
function getCountry() {
    return $(countrySelector).text();
}

function refreshHudHistory(countryName) {
    function lineIt(details) {
        var culture = details.culture;
        if (culture == "") {
            culture = 'pri';
        }

        return details.turn + ": " + details.population + culture + "," + details.soldiers;
    }

    if (conqueredProvinces.includes(countryName)) {
        updateHud("");
        return;
    }

    var history = provincesHistory[countryName];

    var lines = [];
    for (var i = history.length - 1; i > -1; i--) {
        lines.push(lineIt(history[i]));
    }
    
    updateHudHtml(lines.join("<br>"));
}

var lastCountry = "";

function refreshName() {
    var country = getCountry().toLowerCase();
    if (country !== lastCountry) {
        lastCountry = country;
        refreshHudHistory(country);
    }
}

var refreshNameInterval;
clearInterval(refreshNameInterval);
refreshNameInterval = setInterval(refreshName, 200);
