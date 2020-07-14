import { IProvinceNeighbourhoodProvider } from "./IProvinceNeighbourhoodProvider";
import { Provinces } from "../Provinces";

export class EuropeMapProvinceNeighbourhoodProvider implements IProvinceNeighbourhoodProvider {
  getNeighborhood(): Record<string, string[]> {
    const neighborhood: Record<string, string[]> = {};

    neighborhood.natolia = ["nicaea", "syria", "cyprus"];

    neighborhood.nicaea = ["natolia", "byzantium", "greece", "crete"];
    neighborhood.crete = ["greece", "nicaea"];
    neighborhood.greece = ["macedonia", "nicaea", "crete"];
    neighborhood.byzantium = ["macedonia", "nicaea", "bulgaria"];
    neighborhood.macedonia = ["bulgaria", "byzantium", "greece", "napoli", "dalmatia", "serbia"];
    neighborhood.dalmatia = ["macedonia", "venetia", "austria", "hungary", "serbia"];
    neighborhood.serbia = [
      "dalmatia",
      "macedonia",
      "hungary",
      "bulgaria",
      "wallachia",
      "transylvania",
    ];
    neighborhood.wallachia = ["serbia", "moldavia", "bulgaria", "transylvania"];
    neighborhood.transylvania = ["hungary", "poland", "moldavia", "wallachia", "serbia"];
    neighborhood.moldavia = [
      "poland",
      "podolia",
      "ukraine",
      "crimea",
      "bulgaria",
      "wallachia",
      "transylvania",
    ];
    neighborhood.syria = ["natolia", "palestine", "cyprus"];
    neighborhood.cyprus = ["natolia", "palestine", "syria"];
    neighborhood.palestine = ["egypt", "cyprus", "syria"];
    neighborhood.egypt = ["cyrenaica", "palestine"];
    neighborhood.cyrenaica = ["egypt", "tripoli"];
    neighborhood.tripoli = ["cyrenaica", "tunis"];
    neighborhood.tunis = ["sardinia", "sicilia", "tripoli", "algiers"];
    neighborhood.algiers = ["tangiers", "tunis"];
    neighborhood.tangiers = ["grenada", "morocco", "algiers"];
    neighborhood.morocco = ["tangiers"];
    neighborhood.sardinia = ["tunis", "corsica"];
    neighborhood.corsica = ["sardinia", "provence", "genoa", "roma"];
    neighborhood.genoa = ["provence", "burgundy", "helvetica", "venetia", "roma", "corsica"];
    neighborhood.provence = ["aquitaine", "iledefrance", "burgundy", "genoa", "corsica"];
    neighborhood.sicilia = ["napoli", "tunis"];
    neighborhood.napoli = ["sicilia", "macedonia", "roma"];
    neighborhood.roma = ["corsica", "genoa", "napoli", "venetia"];
    neighborhood.venetia = ["genoa", "helvetica", "austria", "dalmatia", "roma"];

    const validProvinces = Provinces.getProvinces();
    for (const key of Object.keys(neighborhood)) {
      const neighbors = neighborhood[key];
      const toCheck = Object.assign([], neighbors);
      toCheck.push(key);
      for (const province of toCheck) {
        if (validProvinces.includes(province) === false) {
          const message = `Wrong neighbor province name '${province}'`;
          console.error(message);
          throw new Error(message);
        }
      }
    }

    return neighborhood;
  }
}
