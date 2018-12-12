function checkBuildingProvinces() {
    for (var i = 0; i < conqueredProvinces.length; i++) {
        var history = provincesHistory[conqueredProvinces[i]];

        var last = history[history.length - 1];

        if (last.population === "4" && last.culture === "pri" && last.production === "farm") {
            buildingAdvices.push(last.name + " should not farm (4pri)");
        }

        // 3**pri buduje farme (albo diplomat).
        if (last.population === "3°°" && last.culture === "pri" && last.production === "farm") {
            buildingAdvices.push(last.name + " should not farm");
        }
    }

    if (buildingAdvices.length) {
        alert(buildingAdvices.join(", "));
        buildingAdvices = [];
    }
}

var buildingAdvices = [];