export class Version {
  static readonly versionNumber: string = "v1_15_1";
  private static readonly versionDescription =
    "Move to empty neutral neighbor (regardless opponent is 2 provinces away)";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
