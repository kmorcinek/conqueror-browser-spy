function loadScript(url) {
    (function (d, s) { s = d.createElement('script'); s.src = url; (d.head || d.documentElement).appendChild(s) })(document);
}

loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js');

function refreshIt() {
    var urls = [
        'buildingChecker.js',
        'conquerorSpy.js',
        'historyChecker.js',
        'provinceOwnership.js',
        'provinces.js',
        'provincesParser.js',
        'hud.js'
    ];

    var baseUrl = "http://127.0.0.1:8887/";
    for (var i = 0; i < urls.length; i++) {
        var url = baseUrl + urls[i];
        loadScript(url);
    }
}

setTimeout(function() {
    refreshIt();
}, 2000)
