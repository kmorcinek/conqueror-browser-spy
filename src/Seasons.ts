import { Season } from "./Season";

export class Seasons {
  static parseSeason(turn: number) {
    const remaining = turn % 4;

    switch (remaining) {
      case 0:
        return Season.Winter;
      case 1:
        return Season.Spring;
      case 2:
        return Season.Summer;
      case 3:
        return Season.Autumn;
    }
  }
}
