export class DateFormatters {
  static convertISOStringToDate(isoString: string | null): Date | null {
    if (typeof isoString != "string") {
      return isoString;
    } else if (!isoString) {
      return null;
    }

    return new Date(isoString);
  }
  static convertISOStringToDispDate(isoString: string | null): string {
    if (!isoString) {
      return "None";
    }
    const splitDate = isoString.split("T")[0];

    return splitDate.replaceAll("-", "/");
  }
}
