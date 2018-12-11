var conqueredProvinces = [];

var playerColors = ['#ff3131', '#009c00'];

function updateOwnedProvinces() {
    function createId(prefix, province) {
        return prefix + province.toLowerCase();
    }

    for (var i = 0; i < provinces.length; i++) {
        var provinceName = provinces[i];

        if (conqueredProvinces.includes(provinceName)) {
            continue;
        }

        // TODO: prefetch it
        var a = document.getElementsByClassName("svgMap")[0];
        var svgDoc = a.contentDocument;

        var map = svgDoc.getElementById(createId("field_", provinceName));

        var color = map.getAttribute("fill");

        if (playerColors.includes(color)) {
            conqueredProvinces.push(provinceName);
        }
    }
}