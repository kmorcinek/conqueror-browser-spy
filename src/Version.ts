export class Version {
  static readonly versionNumber = "v1.14";
  private static readonly versionDescription = "can reenter game when it was exited at turn 1";

  static getFullVersion(): string {
    return `${this.versionNumber} - ${this.versionDescription}`;
  }
}
