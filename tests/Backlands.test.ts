import { expect } from "chai";
import { ProvinceFactory } from "./ProvinceFactory";
import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceOwner } from "../src/ProvinceOwner";
import { IBattleProvinceNeighborhoods } from "../src/ai/IBattleProvinceNeighborhoods";
import { NeighbourhoodBuilder } from "./NeighbourhoodBuilder";
import { Backlands } from "../src/ai/backland/Backlands";

describe("Backlands", () => {
  it("should choose the only province without opponent neighbours", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "nicaea";
    const backlandProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "natolia";
    const myProvinceNextToOpponent = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    const opponentProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    // nicaea <-> natolia <-> syria(Opponent)
    NeighbourhoodBuilder.connect(backlandProvince, myProvinceNextToOpponent);
    NeighbourhoodBuilder.connect(myProvinceNextToOpponent, opponentProvince);

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      // tslint:disable: no-empty
      getManyPathWithDistance2: () => [],
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [backlandProvince, myProvinceNextToOpponent],
      getByName: () => backlandProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 0,
      getPath: () => [],
      // tslint:enable: no-empty
    };
    const sut = new Backlands(battleProvinceNeighborhoods);
    sut.chooseBacklands();

    expect(sut.isBackland(backlandProvince.name)).to.equals(true);
    expect(sut.isBackland(myProvinceNextToOpponent.name)).to.equals(false);
  });

  it("should choose province farther from opponent", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "crete";
    const farFarAwayProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "nicaea";
    const awayProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "natolia";
    const myProvinceNextToOpponent = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    const opponentProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    // crete <-> nicaea <-> natolia <-> syria(Opponent)
    NeighbourhoodBuilder.connect(farFarAwayProvince, awayProvince);
    NeighbourhoodBuilder.connect(awayProvince, myProvinceNextToOpponent);
    NeighbourhoodBuilder.connect(myProvinceNextToOpponent, opponentProvince);
    farFarAwayProvince.updateClosestOpponents([opponentProvince], 3);
    awayProvince.updateClosestOpponents([opponentProvince], 2);
    myProvinceNextToOpponent.updateClosestOpponents([opponentProvince], 1);

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      // tslint:disable: no-empty
      getManyPathWithDistance2: () => [],
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [farFarAwayProvince, awayProvince, myProvinceNextToOpponent],
      getByName: () => awayProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 0,
      getPath: () => [],
      // tslint:enable: no-empty
    };
    const sut = new Backlands(battleProvinceNeighborhoods);
    sut.chooseBacklands();

    expect(sut.isBackland(farFarAwayProvince.name)).to.equals(true);
    expect(sut.isBackland(awayProvince.name)).to.equals(false);
    expect(sut.isBackland(myProvinceNextToOpponent.name)).to.equals(false);
  });
});
