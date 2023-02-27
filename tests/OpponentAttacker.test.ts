import { expect } from "chai";
import { ProvinceFactory } from "./ProvinceFactory";
import { ProvinceOwner } from "../src/ProvinceOwner";
import { OpponentAttacker } from "../src/ai/OpponentAttacker";
import { IArmyMovesRecorder } from "../src/ai/IArmyMovesRecorder";
import { ArmyMove } from "../src/ai/ArmyMove";
import { BattleProvinceFactory } from "./BattleProvinceFactory";

describe("OpponentAttacker ", () => {
  it("should OpponentAttacker work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 22;
    const battleProvinceFactory = new BattleProvinceFactory();
    battleProvinceFactory.provinceFactory = provinceFactory;
    battleProvinceFactory.provinceOwner = ProvinceOwner.Me;
    const sourceProvince = battleProvinceFactory.build();

    provinceFactory.name = "syria";
    provinceFactory.soldiers = 11;
    battleProvinceFactory.provinceOwner = ProvinceOwner.Opponent;
    const targetProvince = battleProvinceFactory.build();

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

    sut.attackOpponents([targetProvince], sourceProvince);

    expect(result).to.not.equal(undefined);
    expect(result?.source).to.equal(sourceProvince);
  });

  it("should attackOpponent not move further from opponent capital", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 22;
    const battleProvinceFactory = new BattleProvinceFactory();
    battleProvinceFactory.provinceFactory = provinceFactory;

    // My province
    battleProvinceFactory.provinceOwner = ProvinceOwner.Me;
    battleProvinceFactory.opponentCapitalDistance = 2;
    const sourceProvince = battleProvinceFactory.build();

    // province to attack
    provinceFactory.name = "syria";
    provinceFactory.soldiers = 1;
    battleProvinceFactory.provinceOwner = ProvinceOwner.Opponent;
    battleProvinceFactory.opponentCapitalDistance = 3;
    const targetProvince = battleProvinceFactory.build();

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

    sut.attackOpponents([targetProvince], sourceProvince);

    expect(result).to.equal(undefined);
  });

  it("should attackOpponent not move closer to own capital", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 22;
    const battleProvinceFactory = new BattleProvinceFactory();
    battleProvinceFactory.provinceFactory = provinceFactory;

    // My province
    battleProvinceFactory.provinceOwner = ProvinceOwner.Me;
    battleProvinceFactory.ownCapitalDistance = 2;
    const sourceProvince = battleProvinceFactory.build();

    // province to attack
    provinceFactory.name = "syria";
    provinceFactory.soldiers = 1;
    battleProvinceFactory.provinceOwner = ProvinceOwner.Opponent;
    battleProvinceFactory.ownCapitalDistance = 1;
    const targetProvince = battleProvinceFactory.build();

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

    sut.attackOpponents([targetProvince], sourceProvince);

    expect(result).to.equal(undefined);
  });
});
