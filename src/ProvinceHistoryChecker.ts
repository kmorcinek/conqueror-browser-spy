import { Culture } from "./Culture";
import { Province } from "./Province";

export class ProcinceHistoryChecker {
  checkHistory(history: Province[]): string | null {
    if (history.length === 0 || history.length === 1) {
      return null;
    }

    const result = this.checkHistory11turn2farmsPlus1Developing(history);
    if (result !== null) {
      return result;
    }

    return this.checkHistory11turn3farmsDeveloping(history);
  }

  checkHistory11turn3farmsDeveloping(history: Province[]): string | null {
    // population 3 is longer than x (5?) => developing
    // -start from last one
    const last = history[history.length - 1];
    const lastSoldiersCount = last.soldiers;

    if (last.farms === 3 && last.resources === 0 && last.culture === Culture.Primitive) {
      let counter = 0;
      for (let i = history.length - 2; i > -1; i--) {
        const current = history[i];
        if (current.farms === 3 && last.resources === 0 && lastSoldiersCount <= current.soldiers) {
          counter++;
        }
      }

      if (counter > 5) {
        return last.name + " is developing";
      }
    }

    return null;
  }

  checkHistory11turn2farmsPlus1Developing(history: Province[]): string | null {
    // population 3 is longer than x (5?) => developing
    // -start from last one
    const last = history[history.length - 1];
    const lastSoldiersCount = last.soldiers;

    if (last.farms === 2 && last.resources === 1 && last.culture === Culture.Primitive) {
      let counter = 0;
      for (let i = history.length - 2; i > -1; i--) {
        const current = history[i];
        if (current.farms === 2 && last.resources === 1 && lastSoldiersCount <= current.soldiers) {
          counter++;
        }
      }

      if (counter > 5) {
        return last.name + " is developing";
      }
    }

    return null;
  }
}
