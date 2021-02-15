import Challenge, { IChallenge } from "../models/Challenge";

export default class ChallengeStorage {
  public static async getChallenge(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge> {
    const result = await ChallengeStorage.getChallenges(params);
    return result.length > 0 ? result[0] : null;
  }

  public static async getChallenges(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge[]> {
    const query = {};
    if (params) {
      if (params.id) {
        Object.assign(query, Array.isArray(params.id) ? {_id: { $in: params.id }} : { _id: params.id });
      }
      if (params.nbSynonyms) {
        Object.assign(query, { allowedTags: { $size: params.nbSynonyms }});
      }
    }
    return Challenge.find(query);
  }

  public static async updateChallenge(challenge: IChallenge) {
    return Challenge.findOneAndUpdate({ '_id': challenge._id }, { $set: challenge }, { useFindAndModify: false });
  }
}
