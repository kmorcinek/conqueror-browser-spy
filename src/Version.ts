export class Version {
  static readonly versionNumber = "v1.17.1";
  private static readonly versionDescription = "skip AI on maps with more than 2 players";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
