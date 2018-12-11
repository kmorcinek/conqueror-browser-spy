var conqueredProvinces = [];

var playerColors = [
    '#ff3131', '#009c00', '#3131ff', '#ffce00', '#636300',
    '#63319c', '#ce63ce', '#ce9c63', '#006363', '#319c9c'];

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