export class Version {
  static readonly versionNumber = "v1.15.1";
  private static readonly versionDescription =
    "Move to empty neutral neighbor (regardless opponent is 2 provinces away)";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
