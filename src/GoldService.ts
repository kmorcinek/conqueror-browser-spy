export class GoldService {
  private current: number = NaN;
  private support: number = NaN;

  update() {
    this.current = this.getAmount("gold");
    this.support = this.getAmount("costs");
  }

  getCurrent() {
    return this.current;
  }

  getSupport() {
    return this.support;
  }

  private getAmount(className: string) {
    const gold = document.getElementsByClassName(className)[0].childNodes[3]!.textContent;
    console.log(`${className}: '${gold}'`);
    return parseInt(gold!);
  }
}
