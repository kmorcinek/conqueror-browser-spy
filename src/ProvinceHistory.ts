import { Province } from "./Province";

export class ProvinceHistory {
  static wasSomethingBuilt(current: Province, previous: Province) {
    if (
      current.farms === previous.farms &&
      current.culture === previous.culture &&
      current.soldiers <= previous.soldiers &&
      current.fort === previous.fort
    ) {
      return false;
    }

    return true;
  }

  history: Province[] = [];

  add(newProvince: Province) {
    const turns = this.history.map(function(province: Province) {
      return province.turn;
    });

    if (turns.includes(newProvince.turn)) {
      throw new Error(`turn '${newProvince.turn}' already exists in history`);
    }

    const max = Math.max.apply(null, turns);
    if (max > newProvince.turn) {
      throw new Error(`new province turn '${newProvince.turn}' has to greater than previous`);
    }

    if (this.history.length > 0 && this.history[0].resources !== newProvince.resources) {
      throw new Error(
        `new province resources '${newProvince.resources}' differ from previous resources '${this.history[0].resources}'`
      );
    }

    this.history.push(newProvince);
  }

  getLast(): Province {
    return this.history[this.history.length - 1];
  }

  getHistory() {
    // shallow copy
    return [...this.history];
  }

  getLength() {
    return this.history.length;
  }

  findHistoryAfterBuildingFinished(): Province {
    let previous: Province | null = null;
    const reversedHistory = this.getHistory().reverse();
    for (const current of reversedHistory) {
      if (previous === null) {
        previous = current;
        continue;
      }

      if (ProvinceHistory.wasSomethingBuilt(current, previous)) {
        return previous;
      }
      previous = current;
    }

    return this.history[0];
  }
}
