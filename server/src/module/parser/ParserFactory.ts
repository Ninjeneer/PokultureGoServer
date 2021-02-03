import GoogleParser from "./GoogleParser";

export default class ParserFactory {
  public static createGoogleParser() {
    return new GoogleParser();
  }
}
