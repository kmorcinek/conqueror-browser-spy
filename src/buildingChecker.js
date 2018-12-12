function checkBuildingProvinces() {
    for (var i = 0; i < conqueredProvinces.length; i++) {
        var history = provincesHistory[conqueredProvinces[i]];

        var last = history[history.length - 1];

        var patterns = [
            {
                population: "4",
                culture: "pri",
                production: "farm",
                message = "should not farm"
            }
        ];

        for (var j = 0; j < patterns.length; j++) {
            var pattern = patterns[j];

            if (last.population === pattern.population &&
                last.culture === pattern.culture &&
                last.production === pattern.production) {

                buildingAdvices.push(last.name + " " + pattern.message);
            }
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