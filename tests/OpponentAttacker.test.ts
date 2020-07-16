import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceOwner } from "../src/ProvinceOwner";
import { OpponentAttacker } from "../src/ai/OpponentAttacker";
import { IArmyMovesRecorder } from "../src/ai/IArmyMovesRecorder";
import { ArmyMove } from "../src/ai/ArmyMove";

describe("OpponentAttacker ", () => {
  it("should OpponentAttacker work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.name = "natolia";
    provinceFactory.farms = 3;
    provinceFactory.resources = 0;
    provinceFactory.soldiers = 22;
    const sourceProvince = provinceFactory.build();

    provinceFactory.name = "syria";
    provinceFactory.soldiers = 11;
    const targetProvince = provinceFactory.build();

    let result: ArmyMove | undefined;
    const armyMovesRecorder: IArmyMovesRecorder = {
      // tslint:disable: no-empty
      addMove: (armyMove: ArmyMove) => {
        result = armyMove;
      },
      isFull: () => false,
      getArmyMoves: () => [],
      clearMoves: () => {},
    };

    const sut = new OpponentAttacker(armyMovesRecorder);

    const sourceBattleProvince = new BattleProvince(sourceProvince, ProvinceOwner.Me);
    const targetBattleProvince = new BattleProvince(targetProvince, ProvinceOwner.Opponent);

    sut.attackOpponents([targetBattleProvince], sourceBattleProvince);

    expect(result).to.not.equal(undefined);
    expect(result!.source).to.equal(sourceBattleProvince);
  });
});
