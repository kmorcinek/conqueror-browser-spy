export class Version {
  static readonly versionNumber = "v1.17";
  private static readonly versionDescription = "fix security dependencies";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
