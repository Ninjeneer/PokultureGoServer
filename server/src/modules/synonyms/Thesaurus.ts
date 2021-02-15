import Synonym from "./Synonym";
import axios from 'axios';
import config from '../../../assets/config.json'
import { StatusCodes } from "http-status-codes";

export default class Thesaurus extends Synonym {
  private synonymMap: Map<String, string[]>;

  constructor() {
    super();
    this.synonymMap = new Map();
  }

  async getSynonymsOf(word: string): Promise<string[]> {
    if (!this.synonymMap.has(word)) {
      const response = await axios.get(`https://www.dictionaryapi.com/api/v3/references/thesaurus/json/${word}?key=${config.thesaurusKey}`);
      const synonyms: string[] = [word];
      if (response.status === StatusCodes.OK) {
        if (!response.data[0].meta) {
          this.synonymMap.set(word, []);
          return [];
        }
        for (const data of response.data[0].meta.syns) {
          if (Array.isArray(data)) {
            synonyms.push(...data);
          } else if (data !== null && data !== "") {
            synonyms.push(data);
          }
        }
        this.synonymMap.set(word, synonyms);
        return synonyms;
      } else {
        return [];
      }
    } else {
      return new Promise((r) => r(this.synonymMap.get(word)));
    }
  }

  private exploreArray(data: any): any {
    if (Array.isArray(data)) {
      return this.exploreArray(data);
    } else {
      return data;
    }
  }
}
