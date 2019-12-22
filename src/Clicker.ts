import { Production } from "./Production";
import { Greeter } from "./Globals";

export class Clicker {
  changeProvinceProduction(provinceName: string, production: Production) {
    console.log("clicking " + provinceName);
    this.clickProvince(provinceName);
    console.log("clicking " + production);
    this.clickProduction(production);
  }

  clickProvince(provinceName: string) {
    const provinceElement = this.getProvinceElement(provinceName);
    this.click(provinceElement);
  }

  moveArmy(sourceProvince: string, targetProvince: string, decrementArmySize: number) {
    console.log("Moving soldiers from " + sourceProvince + " to " + targetProvince);

    this.mouseDown(this.getProvinceElement(sourceProvince));
    const targetProvinceElement = this.getProvinceElement(targetProvince);
    this.mouseMove(targetProvinceElement);
    this.mouseUp(targetProvinceElement);

    for (let i = 0; i < decrementArmySize; i++) {
      this.decrementArmy();
    }

    this.confirmArmy();
  }

  private getProvinceElement(provinceName: string) {
    const mapDocument = Greeter.getMapDocument();
    return mapDocument.getElementById("field_" + provinceName)!;
  }

  private decrementArmy() {
    const submitButton = document.getElementsByClassName("decUnits")[0];
    this.click(submitButton);
  }

  private confirmArmy() {
    const submitButton = document.getElementsByClassName("submit")[0];
    this.click(submitButton);
  }

  private click(element: Element | null) {
    if (element !== null) {
      this.mouseDown(element);
      this.mouseUp(element);
    }
  }

  private mouseDown(element: Element) {
    element.dispatchEvent(new Event("mousedown"));
  }

  private mouseMove(element: Element) {
    element.dispatchEvent(new Event("mousemove"));
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
