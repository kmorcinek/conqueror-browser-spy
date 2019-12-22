import { Production } from "./Production";

export class Clicker {
  changeProvinceProduction(provinceName: string, production: Production) {
    console.log("clicking " + provinceName);
    this.clickProvince(provinceName);
    console.log("clicking " + production);
    this.clickProduction(production);
  }

  private clickProvince(provinceName: string) {
    const svgDoc = (document.getElementsByClassName("svgMap")[0] as any).contentDocument;
    const provinceElement = svgDoc.getElementById("field_" + provinceName);
    this.click(provinceElement);
  }

  private click(element: Element) {
    this.mouseDown(element);
    this.mouseUp(element);
  }

  private mouseDown(element: Element) {
    element.dispatchEvent(new Event("mousedown"));
  }

  private mouseUp(element: Element) {
    element.dispatchEvent(new Event("mouseup"));
  }

  private clickProduction(production: Production) {
    const className = this.getProductionClass(production);
    this.clickByClassName(className);
  }

  private getProductionClass(production: Production): string {
    switch (production) {
      case Production.Soldier:
        return "fieldPropUnits";
      case Production.Gold:
        return "fieldPropGold";
      case Production.Farm:
        return "fieldPropPop";
      case Production.Culture:
        return "fieldPropCulture";
      case Production.Fort:
        return "fieldPropFort";
      case Production.Diplomat:
        return "fieldPropAttitude";
    }
  }

  private clickByClassName(className: string) {
    const element = document.getElementsByClassName(className)[0];
    this.click(element);
  }
}
