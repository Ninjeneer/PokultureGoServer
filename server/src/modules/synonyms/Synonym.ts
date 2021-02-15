export default abstract class Synonym {
  abstract getSynonymsOf(word: string): Promise<string[]>;
}
