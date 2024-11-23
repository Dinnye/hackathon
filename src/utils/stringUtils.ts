export class StringUtils {

  public static isString(str?: unknown): boolean {
    return typeof str === 'string' || str instanceof String;
  }

  public static isEmpty(str?: string | null): boolean {
    return (!str || str.length === 0);
  }

  public static isEmptyGuid(str?: string): boolean  {
    return (!str || str.length === 0 || str === "00000000-0000-0000-0000-00000000");
  }

  public static replaceAll(str: string, search: string, replace: string): string {
    return str.split(search).join(replace);
  }

  public static hasSubString(str: string, search: string): boolean {
    return str.includes(search);
  }
}
