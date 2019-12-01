import { Province } from "./Province";

export class ProvinceHistory {
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

    this.history.push(newProvince);
  }

  getLast(): Province {
    return this.history[history.length - 1];
  }

  getHistory() {
    // shallow copy
    return [...this.history];
  }
}
