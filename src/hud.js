function initHud() {
    if ($('#hud').length) {
        return;
    }

    var timerWrapperSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnTimer';

    var timerWrapper = $(timerWrapperSelector);

    var hud = $('<div id="hud" style="margin-top: 20px;"></div>');
    timerWrapper.append(hud);
}

function updateHud(text) {
    initHud();
    $('#hud').text(text)
}

function updateHudHtml(html) {
    initHud();
    $('#hud').html(html)
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