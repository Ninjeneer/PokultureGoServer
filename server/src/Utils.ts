import config from '../assets/config.json'

export default class Utils {
  public static buildAllTypesArray() {
    const types = [];
    for (const type of config.allowedTypes) {
      types.push(...type.values)
    }
    return types;
  }

  public static parseBoolean(s: string) {
    return s.toLowerCase() === 'true';
  }
}
