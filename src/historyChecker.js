function checkProvinces() {
    for (var i = 0; i < provinces.length; i++) {
        var provinceName = provinces[i];

        if (conqueredProvinces.includes(provinceName)) {
            continue;
        }

        checkHistory(provincesHistory[provinceName]);
    }

    // TODO: refactor alertsToShow
    if (alertsToShow.length) {
        alert(alertsToShow.join(", "));
        alertsToShow = [];
    }
}

var alertsToShow = [];

function checkHistory(history) {
    if (history.length === 0) {
        return;
    }

    // population 3 is longer than x (5?) => developing
    // -start from last one
    var last = history[history.length - 1];
    var lastSoldiersCount = last.soldiers;

    if (last.population === "3" && last.culture === "pri") {
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

