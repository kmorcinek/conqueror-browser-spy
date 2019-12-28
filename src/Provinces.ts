export class Provinces {
  static initialize() {
    const europeProvinces = [
      "algiers",
      "aquitaine",
      "aragon",
      "austria",
      "bohemia",
      "brandenburg",
      "brittany",
      "bulgaria",
      "burgundy",
      "byzantium",
      "castile",
      "corsica",
      "crete",
      "crimea",
      "cyprus",
      "cyrenaica",
      "dalmatia",
      "denmark",
      "egypt",
      "eire",
      "england",
      "finland",
      "flanders",
      "gascony",
      "genoa",
      "greece",
      "grenada",
      "hanover",
      "helvetica",
      "holland",
      "hungary",
      "iledefrance",
      "leon",
      "lithuania",
      "livonia",
      "luxembourg",
      "macedonia",
      "moldavia",
      "morocco",
      "muscovy",
      "napoli",
      "natolia",
      "nicaea",
      "normandy",
      "northumberland",
      "norway",
      "palestine",
      "podolia",
      "poland",
      "portugal",
      "provence",
      "prussia",
      "rhineland",
      "roma",
      "sardinia",
      "saxony",
      "scotland",
      "serbia",
      "sicilia",
      "sweden",
      "syria",
      "tangiers",
      "transylvania",
      "tripoli",
      "tunis",
      "ukraine",
      "ulster",
      "venetia",
      "wales",
      "wallachia",
    ];

    const generatedProvinces = [];
    const alphabet = "abcdefghijk";
    for (let i = 1; i < 12; i++) {
      for (let j = 0; j < 11; j++) {
        generatedProvinces.push(alphabet[j] + i);
      }
    }

    Provinces.provinces = europeProvinces.concat(generatedProvinces);
  }

  static getProvinces() {
    return Provinces.provinces;
  }

  private static provinces: string[];
}
Provinces.initialize();
