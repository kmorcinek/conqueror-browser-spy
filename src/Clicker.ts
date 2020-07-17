import { Production } from "./Production";
import { Globals } from "./Globals";
import { BuyProduction } from "./BuyProduction";

export class Clicker {
  changeProvinceProduction(provinceName: string, production: Production | BuyProduction) {
    console.log("Clicking " + provinceName);
    this.clickProvince(provinceName);
    if (production instanceof BuyProduction) {
      this.buyProduction(production.production);
    } else {
      this.clickProduction(production);
    }
  }

  buyProduction(production: Production) {
    this.clickProduction(production);
    console.log("Buying production for " + production);
    if (production === Production.Soldier) {
      this.click(this.getElementByClassName("fieldProdBuyButton2"));
    } else {
      this.click(this.getElementByClassName("fieldProdBuyButton1"));
    }
  }

  clickProvince(provinceName: string) {
    const provinceElement = this.getProvinceElement(provinceName);
    this.click(provinceElement);
  }

  clickEndTurn() {
    console.log("Clicking end turn");
    this.clickByClassName("endTurn");
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
    console.log("Soldiers moved");
  }

  private getProvinceElement(provinceName: string) {
    const mapDocument = Globals.getMapDocument();
    return mapDocument.getElementById("field_" + provinceName)!;
  }

  private decrementArmy() {
    this.clickByClassName("decUnits");
  }

  private getElementByClassName(className: string) {
    return document.getElementsByClassName(className)[0];
  }

  private confirmArmy() {
    this.clickByClassName("submit");
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
    if (this.isActive(production)) {
      console.log(`Production ${production} is already active`);
      return;
    }
    console.log("Changing production to " + production);
    const className = this.getProductionClass(production);
    this.clickByClassName(className);
  }

  private isActive(production: Production) {
    const className = this.getProductionClass(production);
    const element = this.getElementByClassName(className);
    return element.classList.contains("fieldPropActive");
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
    const element = this.getElementByClassName(className);
    this.click(element);
  }
}
