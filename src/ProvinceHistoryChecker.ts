import { Culture } from "./Culture";
import { Province } from "./Province";
import { Production } from "./Production";

export class ProvinceHistoryChecker {
  checkHistory(history: Province[]): Production | null {
    if (history.length === 0 || history.length === 1) {
      return null;
    }

    const results = [
      this.checkHistory11turn2farmsPlus1Developing(history),
      this.checkHistory11turn3farmsDeveloping(history),
      this.checkDevelopingWith4Farms(history),
    ];
    for (const result of results) {
      if (result !== null) {
        return result;
      }
    }

    return null;
  }

  checkHistory11turn3farmsDeveloping(history: Province[]): Production | null {
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
        return Production.Culture;
      }
    }

    return null;
  }

  checkHistory11turn2farmsPlus1Developing(history: Province[]): Production | null {
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
        return Production.Culture;
      }
    }

    return null;
  }

  checkDevelopingWith4Farms(history: Province[]): Production | null {
    const last = history[history.length - 1];
    const lastSoldiersCount = last.soldiers;

    if (last.farms === 4 && last.resources === 0 && last.culture === Culture.Primitive) {
      let counter = 0;
      for (let i = history.length - 2; i > -1; i--) {
        const current = history[i];
        if (
          current.farms === 4 &&
          current.resources === 0 &&
          lastSoldiersCount <= current.soldiers
        ) {
          counter++;
        }
      }

      if (counter > 3) {
        return Production.Culture;
      }
    }

    return null;
  }
}
