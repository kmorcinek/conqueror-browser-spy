function loadScript(url) {
    (function (d, s) { s = d.createElement('script'); s.src = url; (d.head || d.documentElement).appendChild(s) })(document);
}

loadScript('https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js');

function refreshIt() {
    var url = 'http://127.0.0.1:8887/conquerorSpy.js';
    loadScript(url);

    var url = 'http://127.0.0.1:8887/provinceOwnership.js';
    loadScript(url);
}

setTimeout(function() {
    refreshIt();
}, 2000)
