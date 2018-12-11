var conqueredProvinces = [];

function updateOwnedProvinces() {
    console.log('konio');
    return;

    for (var i = 0; i < provinces.length; i++) {
        var provinceName = provinces[i];

        var province = getCountryDetails(provinceName);

        provincesHistory[provinceName].push(province);

        checkHistory(provincesHistory[provinceName]);
    }
}