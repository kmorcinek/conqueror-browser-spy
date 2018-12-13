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
            },
            {
                population: "5",
                culture: "pri",
                production: "farm",
                message = "should not farm"
            },
            {
                population: "6",
                culture: "dev",
                production: "farm",
                message = "should not farm"
            },
            {
                population: "4",
                culture: "dev",
                production: "culture",
                message = "should not advance"
            },
            {
                population: "5",
                culture: "dev",
                production: "culture",
                message = "should not advance"
            },
            {
                population: "4**",
                culture: "dev",
                production: "farm",
                message = "should not farm"
            },
            {
                population: "3**",
                culture: "pri",
                production: "farm",
                message = "should not farm"
            },
            {
                population: "4**",
                culture: "pri",
                production: "farm",
                message = "should not farm"
            },
        ];

        for (var j = 0; j < patterns.length; j++) {
            var pattern = patterns[j];

            if (last.population === pattern.population &&
                last.culture === pattern.culture &&
                last.production === pattern.production) {

                buildingAdvices.push(last.name + " " + pattern.message);
            }
        }
    }

    if (buildingAdvices.length) {
        alert(buildingAdvices.join(", "));
        buildingAdvices = [];
    }
}

var buildingAdvices = [];