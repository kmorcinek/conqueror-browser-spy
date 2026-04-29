export class Version {
  static readonly versionNumber = "v1.16";
  private static readonly versionDescription = "back to development";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
