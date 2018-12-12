function checkBuildingProvinces() {
    for (var i = 0; i < conqueredProvinces.length; i++) {
        var history = provincesHistory[conqueredProvinces[i]];

        var last = history[history.length - 1];

        var a = {
            population: "4",
            culture: "pri",
            production: "farm",
            message = "should not farm"
        }

        if (last.population === a.population &&
            last.culture === a.culture &&
            last.production === a.production) {

            buildingAdvices.push(last.name + " " + a.message);
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