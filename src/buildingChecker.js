function checkBuildingProvinces() {
    for (var i = 0; i < conqueredProvinces.length; i++) {
        var history = provincesHistory[conqueredProvinces[i]];

        var last = history[history.length - 1];

        var original = {
            name: last.name,
            farms: parsePopulation(last.population).farms,
            resources: parsePopulation(last.population).resources,
            culture: last.culture,
            production: last.production
        };

        var patterns = [
            {
                farms: 4,
                resources: 0,
                production: "farm",
            },
            {
                farms: 5,
                production: "farm",
            },
            {
                farms: 6,
                culture: "dev",
                production: "farm",
            },
            {
                farms: 4,
                culture: "dev",
                production: "culture",
            },
            {
                farms: 5,
                culture: "dev",
                production: "culture",
            },
            {
                farms: 4,
                resources: 2,
                culture: "dev",
                production: "farm",
            },
            {
                farms: 3,
                resources: 2,
                production: "farm",
            },
            {
                farms: 4,
                resources: 2,
                production: "farm",
            },
            {
                farms: 3,
                resources: 2,
                culture: "dev",
                production: "culture",
            },
        ];

        for (var j = 0; j < patterns.length; j++) {
            var pattern = patterns[j];

            pattern.resources = pattern.resources || 0;
            pattern.culture = pattern.culture || "pri";
        }

        for (var j = 0; j < patterns.length; j++) {
            var pattern = patterns[j];

            if (original.farms === pattern.farms &&
                original.resources === pattern.resources &&
                original.culture === pattern.culture &&
                original.production === pattern.production) {

                buildingAdvices.push(original.name + " should not " + original.production);
            }
        }
    }

    if (buildingAdvices.length) {
        var message = buildingAdvices.join(", ");
        console.log(message);
        alert(message);
        buildingAdvices = [];
    }
}

function parsePopulation(population) {

    var rest = population;
    var resources = 0;

    while (true) {
        if (rest[rest.length - 1].charCodeAt() === 176) {
            var rest = rest.substring(0, rest.length - 1);
            resources++;
        } else {
            break;
        }
    }

    return {
        farms: parseInt(rest),
        resources: resources
    };
}

var buildingAdvices = [];