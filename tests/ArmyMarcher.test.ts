import { expect } from "chai";
import { ProvinceFactory } from "./ProvinceFactory";
import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceOwner } from "../src/ProvinceOwner";
import { IArmyMovesRecorder } from "../src/ai/IArmyMovesRecorder";
import { ArmyMove } from "../src/ai/ArmyMove";
import { ArmyMarcher } from "../src/ai/ArmyMarcher";
import { IBattleProvinceNeighborhoods } from "../src/ai/IBattleProvinceNeighborhoods";

describe("ArmyMarcher", () => {
  it("should marchToTarget move army when middle target is owned by me", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 9;
    const sourceProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    const middleTargetOwnedProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "palestine";
    const targetProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    let result: ArmyMove | undefined;
    const armyMovesRecorder: IArmyMovesRecorder = {
      // tslint:disable: no-empty
      addMove: (armyMove: ArmyMove) => {
        result = armyMove;
      },
      isFull: () => false,
      getArmyMoves: () => [],
      clearMoves: () => {},
      // tslint:enable: no-empty
    };

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      // tslint:disable: no-empty
      getManyPathWithDistance2: () => [],
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [],
      getByName: () => middleTargetOwnedProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 0,
      getPath: () => [middleTargetOwnedProvince.name, targetProvince.name],
      // tslint:enable: no-empty
    };

    const sut = new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder);

    sut.marchToTarget(sourceProvince, targetProvince);

    expect(result).to.not.equal(undefined);
    expect(result!.target).to.equal(middleTargetOwnedProvince);
  });

  it("should marchToTarget NOT move army when middle target is neutral", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 9;
    const sourceProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    const middleTargetNeutralProvince = new BattleProvince(
      provinceFactory.build(),
      ProvinceOwner.Neutral
    );

    provinceFactory.name = "palestine";
    const targetProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    let result: ArmyMove | undefined;
    const armyMovesRecorder: IArmyMovesRecorder = {
      // tslint:disable: no-empty
      addMove: (armyMove: ArmyMove) => {
        result = armyMove;
      },
      isFull: () => false,
      getArmyMoves: () => [],
      clearMoves: () => {},
      // tslint:enable: no-empty
    };

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      getManyPathWithDistance2: () => [[middleTargetNeutralProvince, targetProvince]],
      // tslint:disable: no-empty
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [],
      getByName: () => middleTargetNeutralProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 2,
      getPath: () => [middleTargetNeutralProvince.name, targetProvince.name],
      // tslint:enable: no-empty
    };

    const sut = new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder);

    sut.marchToTarget(sourceProvince, targetProvince);

    expect(result).to.equal(undefined);
  });


  it("should marchToTarget move army through middle neutral target when neutral province is without soldiers", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 9;
    const sourceProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    provinceFactory.soldiers = 0;
    const middleTargetNeutralProvince = new BattleProvince(
      provinceFactory.build(),
      ProvinceOwner.Neutral
    );

    provinceFactory.name = "palestine";
    provinceFactory.soldiers = 3;
    const targetProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    let result: ArmyMove | undefined;
    const armyMovesRecorder: IArmyMovesRecorder = {
      // tslint:disable: no-empty
      addMove: (armyMove: ArmyMove) => {
        result = armyMove;
      },
      isFull: () => false,
      getArmyMoves: () => [],
      clearMoves: () => {},
      // tslint:enable: no-empty
    };

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      getManyPathWithDistance2: () => [[middleTargetNeutralProvince, targetProvince]],
      // tslint:disable: no-empty
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [],
      getByName: () => middleTargetNeutralProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 2,
      getPath: () => [middleTargetNeutralProvince.name, targetProvince.name],
      // tslint:enable: no-empty
    };

    const sut = new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder);

    sut.marchToTarget(sourceProvince, targetProvince);

    expect(result).to.not.equal(undefined);
    expect(result!.source).to.equal(sourceProvince);
    // expect(result?.target).to.equal(middleTargetNeutralProvince.name);
  });

  it("should marchToTarget search for many path and finally find a way through my own provinces", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.name = "natolia";
    provinceFactory.soldiers = 9;
    const sourceProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "syria";
    const middleTargetNeutralProvince = new BattleProvince(
      provinceFactory.build(),
      ProvinceOwner.Neutral
    );

    provinceFactory.name = "cyprus";
    const middleTargetOwnedProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Me);

    provinceFactory.name = "palestine";
    const targetProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);

    let result: ArmyMove | undefined;
    const armyMovesRecorder: IArmyMovesRecorder = {
      // tslint:disable: no-empty
      addMove: (armyMove: ArmyMove) => {
        result = armyMove;
      },
      isFull: () => false,
      getArmyMoves: () => [],
      clearMoves: () => {},
      // tslint:enable: no-empty
    };

    const battleProvinceNeighborhoods: IBattleProvinceNeighborhoods = {
      getManyPathWithDistance2: () => [[middleTargetOwnedProvince, targetProvince]],
      // tslint:disable: no-empty
      recreateNextTurn: () => {},
      getOwnedProvinces: () => [],
      getByName: () => middleTargetNeutralProvince,
      getClosestNotConqueredNeighbors: () => [],
      getDistance: () => 2,
      getPath: () => [middleTargetNeutralProvince.name, targetProvince.name],
      // tslint:enable: no-empty
    };

    const sut = new ArmyMarcher(battleProvinceNeighborhoods, armyMovesRecorder);

    sut.marchToTarget(sourceProvince, targetProvince);

    expect(result).to.not.equal(undefined);
    expect(result!.target).to.equal(middleTargetOwnedProvince);
  });
});
