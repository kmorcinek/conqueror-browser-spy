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

var countrySelector = '#gameWrapper > div > div.area.areaR > div.view.headerView.conqFieldTools.fogOfWar0 > div > div.fieldHeaderWrapper > div.fieldHeader > span'
function getCountry() {
    return $(countrySelector).text();
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
