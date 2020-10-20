export class GoldService {
  private current: number = NaN;
  private support: number = NaN;

  update() {
    this.current = this.getAmount("Gold", "gold");
    this.support = this.getAmount("Support", "costs");
  }

  getCurrent() {
    return this.current;
  }

  getSupport() {
    return this.support;
  }

  private getAmount(uiName: string, className: string) {
    const amount = document.getElementsByClassName(className)[0].childNodes[3]!.textContent;
    console.log(`${uiName}: '${amount}'`);
    return parseInt(amount!);
  }
}
