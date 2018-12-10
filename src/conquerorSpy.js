if (!window.jQuery || confirm('Overwrite\x20current\x20version?\x20v' + jQuery.fn.jquery)) (function (d, s) { s = d.createElement('script'); s.src = 'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.js'; (d.head || d.documentElement).appendChild(s) })(document);
// - check

var turnSelector = '#gameWrapper > div > div.area.areaT > div.area.areaTM > div > div > div > div.turnInfo > div > span.turnCount';

function getTurn() {
    return parseInt($(turnSelector).text().substring(5));
}

// Get details of one province.
// - (without turn)
function getCountryDetails(countryName)
{
    var a = document.getElementsByClassName("svgMap")[0];
    // Get the SVG document inside the Object tag
    var svgDoc = a.contentDocument;

    var id = "pop_" + countryName.toLowerCase();
    // Get one of the SVG items by ID;
    var svgItem = svgDoc.getElementById(id);
    
    var countryDetails = {
        country: countryName,
        population: svgItem.textContent,
        culture: svgItem.className.animVal
    };

    console.log(svgItem);

    return countryDetails;
}

var poland = getCountryDetails('poland');
poland

// TODO: animVal vs baseVal?
//svgItem.className.animVal
