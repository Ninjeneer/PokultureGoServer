import Synonym from "./Synonym";
import Thesaurus from "./Thesaurus";

export default class SynonymFactory {
  public static createThesaurus(): Thesaurus {
    return new Thesaurus();
  }
}
