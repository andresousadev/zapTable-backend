export class Utils {
  static excludeUndefinedProperties<T extends object>(obj: T): Partial<T> {
    const result: Partial<T> = {};

    for (const key in obj) {
      if (obj[key] !== undefined) {
        result[key] = obj[key];
      }
    }

    return result;
  }
}
