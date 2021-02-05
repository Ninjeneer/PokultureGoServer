import GoogleParser from "./GoogleParser";
import OpenDataCsvParser from "./OpenDataCsvParser";

export default class ParserFactory {
  public static createGoogleParser() {
    return new GoogleParser();
  }

  public static createOpenDataCsvParser() {
    return new OpenDataCsvParser();
  }
}
