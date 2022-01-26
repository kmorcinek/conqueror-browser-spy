import { expect } from "chai";
import { Culture } from "../src/Culture";
import { ProvinceFactory } from "./ProvinceFactory";
import { ArmyMoverAi } from "../src/ai/ArmyMoverAi";
import { ProvinceHistoryService } from "../src/ProvinceHistoryService";
import { BattleProvince } from "../src/ai/BattleProvince";
import { ProvinceOwner } from "../src/ProvinceOwner";
import { NeighbourhoodBuilder } from "./NeighbourhoodBuilder";

describe("ArmyMoveAi", () => {
  it("should [sortByProvinceValue] work", () => {
    const provinceFactory = new ProvinceFactory();
    provinceFactory.culture = Culture.Primitive;
    provinceFactory.name = "natolia";
    const primitiveProvince = provinceFactory.build();
    provinceFactory.culture = Culture.Developed;
    provinceFactory.name = "syria";
    const developedProvince = provinceFactory.build();

    expect(primitiveProvince.calculateValue() < developedProvince.calculateValue()).to.equal(true);

    const provinceHistoryService = new ProvinceHistoryService();
    provinceHistoryService.getByName(primitiveProvince.name).add(primitiveProvince);
    provinceHistoryService.getByName(developedProvince.name).add(developedProvince);
    const sut = new ArmyMoverAi(
      null as any,
      null as any,
      null as any,
      null as any,
      null as any,
      null as any
    );

    const neighbors = [
      new BattleProvince(primitiveProvince, ProvinceOwner.Opponent),
      new BattleProvince(developedProvince, ProvinceOwner.Opponent),
    ];

    const sortedProvinces: BattleProvince[] = sut.sortByProvinceValue(neighbors);
    expect(sortedProvinces[0].name).to.equal(developedProvince.name);
    expect(sortedProvinces[1].name).to.equal(primitiveProvince.name);
  });

  // it("should Move to empty neutral neighbor (regardless opponent is 2 provinces away)", () => {
  //   const myProvinceFactory = new ProvinceFactory();
  //   // provinceFactory.culture = Culture.Primitive;
  //   myProvinceFactory.name = "nicaea";
  //   myProvinceFactory.soldiers = 8;
  //   const myProvince = new BattleProvince(myProvinceFactory.build(), ProvinceOwner.Me);

  //   // const primitiveProvince = provinceFactory.build();
  //   // provinceFactory.culture = Culture.Developed;
  //   // provinceFactory.name = "syria";
  //   // const developedProvince = provinceFactory.build();

  //   let neutralProvince: BattleProvince;
  //   {
  //     const neutralProvinceFactory = new ProvinceFactory();
  //     neutralProvinceFactory.name = "natolia";
  //     neutralProvinceFactory.soldiers = 0;
  //     neutralProvince = new BattleProvince(neutralProvinceFactory.build(), ProvinceOwner.Neutral);
  //   }

  //   // provinceFactory.name = "natolia";
  //   // const neutralProvince = new BattleProvince(neutralProvince .build(), ProvinceOwner.Me);

  //   // provinceFactory.name = "syria";
  //   // const opponentProvince = new BattleProvince(provinceFactory.build(), ProvinceOwner.Opponent);
  //   const opponentProvinceFactory = new ProvinceFactory();
  //   opponentProvinceFactory.name = "syria";
  //   // opponentProvinceFactory.soldiers = 0;
  //   const opponentProvince = new BattleProvince(opponentProvinceFactory.build(), ProvinceOwner.Opponent);

  //   // nicaea(Mine) <-> natolia(Neutral) <-> syria(Opponent)
  //   NeighbourhoodBuilder.connect(myProvince, neutralProvince);
  //   NeighbourhoodBuilder.connect(neutralProvince, opponentProvince);

  //   // expect(primitiveProvince.calculateValue() < developedProvince.calculateValue()).to.equal(true);

  //   const provinceHistoryService = new ProvinceHistoryService();
  //   provinceHistoryService.getByName(primitiveProvince.name).add(primitiveProvince);
  //   provinceHistoryService.getByName(developedProvince.name).add(developedProvince);
  //   const sut = new ArmyMoverAi(
  //     null as any,
  //     null as any,
  //     null as any,
  //     null as any,
  //     null as any,
  //     null as any
  //   );

  //   const neighbors = [
  //     new BattleProvince(primitiveProvince, ProvinceOwner.Opponent),
  //     new BattleProvince(developedProvince, ProvinceOwner.Opponent),
  //   ];

  //   sut.moveArmies();
  //   // const sortedProvinces: BattleProvince[] = sut.sortByProvinceValue(neighbors);
  //   // expect(sortedProvinces[0].name).to.equal(developedProvince.name);
  //   // expect(sortedProvinces[1].name).to.equal(primitiveProvince.name);
  // });
});
