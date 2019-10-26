var turnSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount';

function getTurn() {
    return parseInt($(turnSelector).text().substring(5));
}

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
        checkProvinces();
        updateOwnedProvinces();
        checkBuildingProvinces();

        console.log("refreshTurn() finished");
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

    allertsToShow = [];
    buildingAdvices = [];
}

cleanAllValues();

var refrestTurnInterval;
clearInterval(refrestTurnInterval);
refrestTurnInterval = setInterval(refreshTurn, 500);

var countrySelector = '#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0 > div > div.fieldHeaderWrapper > div.fieldHeader > span'
function getCountry() {
    var text = $(countrySelector).text().toLowerCase();

    function removeDiacritics(str) { return str.normalize('NFD').replace(/[\u0300-\u036f]/g, ""); }

    text = removeDiacritics(text);

    if (text === "ile de france") {
        text = "iledefrance";
    }

    return text;
}

var lastCountry = "";

function refreshName() {
    var country = getCountry();
    if (country !== lastCountry) {
        lastCountry = country;
        refreshHudHistory(country);
    }
}

var refreshNameInterval;
clearInterval(refreshNameInterval);
refreshNameInterval = setInterval(refreshName, 200);

var toolVersion = '1.0';

console.log("tool version: " + toolVersion);
