function checkBuildingProvinces() {
var conqueredProvinces = [];

    for (var i = 0; i < conqueredProvinces.length; i++) {
        var history = provincesHistory[conqueredProvinces[i]];

        var last = history[history.length - 1];

        // 3**pri buduje farme (albo diplomat).
        if (last.population === "3°°" && last.culture === "pri" && last.production === "fort") {
            
        }
    }
}