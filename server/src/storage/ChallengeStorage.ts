import Challenge, { IChallenge } from "../models/Challenge";
import mongoose from 'mongoose';

export default class ChallengeStorage {
  public static async getChallenge(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge> {
    const result = await ChallengeStorage.getChallenges(params);
    return result.length > 0 ? result[0] : null;
  }

  public static async getChallenges(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge[]> {
    const aggregation = [];
    if (params) {
      const and = [];
      if (params.id) {
        and.push(Array.isArray(params.id) ? {_id: { $in: params.id.map(id => mongoose.Types.ObjectId(id)) }} : { _id: mongoose.Types.ObjectId(params.id) });
      }
      if (params.nbSynonyms) {
        and.push({ allowedTags: { $size: params.nbSynonyms }})
      }
      if (and.length > 0) {
        aggregation.push({ $match: { $and: and } });
      }
    }
    return aggregation.length > 0 ? Challenge.aggregate(aggregation) : Challenge.find();
  }

  public static async updateChallenge(challenge: IChallenge) {
    return Challenge.findOneAndUpdate({ '_id': challenge._id }, { $set: challenge }, { useFindAndModify: false });
  }
}
