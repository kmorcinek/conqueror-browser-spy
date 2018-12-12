function loadScript(url) {
    (function (d, s) { s = d.createElement('script'); s.src = url; (d.head || d.documentElement).appendChild(s) })(document);
}

loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js');

function refreshIt() {
    var urls = [
        'http://127.0.0.1:8887/conquerorSpy.js',
        'http://127.0.0.1:8887/provinceOwnership.js'
    ];

    for (var i = 0; i < urls.length; i++) {
        var url = urls[i];
        loadScript(url);
    }
}

setTimeout(function() {
    refreshIt();
}, 2000)
