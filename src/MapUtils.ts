export class MapUtils {
  static createId(prefix: string, province: string) {
    return prefix + province.toLowerCase();
  }
}
