var europeProvinces = [
    "eire", "ulster", "scotland", "wales", "northumberland", "england", "norway", "sweden", "finland", "denmark",
    "livonia", "muscovy", "ukraine", "crimea", "lithuania", "podolia", "prussia", "poland", "moldavia", "wallachia",
    "transylvania", "hungary", "serbia", "bulgaria", "dalmatia", "byzantium", "macedonia", "greece", "crete", "nicaea",
    "natolia", "syria", "palestine", "cyprus", "egypt", "cyrenaica", "tripoli", "tunis", "sicilia", "napoli", "roma",
    "sardinia", "corsica", "algiers", "tangiers", "morocco", "grenada", "portugal", "leon", "aragon", "castile",
    "gascony", "brittany", "aquitaine", "provence", "iledefrance", "normandy", "burgundy", "flanders", "holland",
    "luxembourg", "genoa", "venetia", "helvetica", "austria", "rhineland", "bohemia", "saxony", "hanover", "brandenburg"
];

var generatedProvinces = [];
var alphabet = "abcdefghijk";
for (var i = 1; i < 12; i++) {
    for (var j = 0; j < 11; j++) {
        generatedProvinces.push(alphabet[j] + i);
    } 
}

var provinces = europeProvinces.concat(generatedProvinces);