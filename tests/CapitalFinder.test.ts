import { expect } from "chai";
import { CapitalFinder } from "../src/CapitalFinder";
import { IHtmlDocument } from "../src/IHtmlDocument";
import { ElementMock } from "./ElementMock";

describe("CapitalFinderTest", () => {
  it("should parse b2", () => {
    const htmlDocumentMock: IHtmlDocument = {
      getElementsByClassName: () => {
        return [];
      },
    };
    const sut = new CapitalFinder(htmlDocumentMock);
    const parsedCapitalName: string = sut.parseCapitalName("capital_top_b2_0");
    expect(parsedCapitalName).to.be.equal("b2");
  });

  it("should parse natolia", () => {
    const htmlDocumentMock: IHtmlDocument = {
      getElementsByClassName: () => {
        return [];
      },
    };
    const sut = new CapitalFinder(htmlDocumentMock);
    const parsedCapitalName: string = sut.parseCapitalName("capital_top_natolia_0");
    expect(parsedCapitalName).to.be.equal("natolia");
  });

  it("should find my and opponent capitals", () => {
    const mapMock: IHtmlDocument = {
      getElementsByClassName: (classNames: string) => {
        if (classNames === "capital_top") {
          const a3 = new ElementMock();
          a3.id = "capital_top_a3_0";
          const c4 = new ElementMock();
          c4.id = "capital_top_c4_0";
          return [a3.toElement(), c4.toElement()];
        } else {
          throw new Error(`unknown class names '${classNames}' requested on mock`);
        }
      },
    };

    const htmlDocumentMock: IHtmlDocument = {
      getElementsByClassName: (classNames: string) => {
        if (classNames === "svgMap") {
          const element = new ElementMock();
          element.contentDocument = mapMock;
          return [(element as unknown) as Element];
        } else if (classNames === "spotName") {
          const element = new ElementMock();
          element.textContent = "Lord of a3";
          return [element.toElement()];
        } else {
          throw new Error(`unknown class names '${classNames}' requested on mock`);
        }
      },
    };

    const sut = new CapitalFinder(htmlDocumentMock);
    sut.setCapitals();
    expect(sut.getMyCapital()).to.be.equal("a3");
    expect(sut.getOpponentCapital()).to.be.equal("c4");
  });

  it("should find my and opponent capitals - reversed", () => {
    const mapMock: IHtmlDocument = {
      getElementsByClassName: (classNames: string) => {
        if (classNames === "capital_top") {
          const a3 = new ElementMock();
          a3.id = "capital_top_a3_0";
          const c4 = new ElementMock();
          c4.id = "capital_top_c4_0";
          return [a3.toElement(), c4.toElement()];
        } else {
          throw new Error(`unknown class names '${classNames}' requested on mock`);
        }
      },
    };

    const htmlDocumentMock: IHtmlDocument = {
      getElementsByClassName: (classNames: string) => {
        if (classNames === "svgMap") {
          const element = new ElementMock();
          element.contentDocument = mapMock;
          return [(element as unknown) as Element];
        } else if (classNames === "spotName") {
          const element = new ElementMock();
          element.textContent = "Lord of c4";
          return [element.toElement()];
        } else {
          throw new Error(`unknown class names '${classNames}' requested on mock`);
        }
      },
    };

    const sut = new CapitalFinder(htmlDocumentMock);
    sut.setCapitals();
    expect(sut.getMyCapital()).to.be.equal("c4");
    expect(sut.getOpponentCapital()).to.be.equal("a3");
  });
});
