import Challenge, { IChallenge } from "../models/Challenge";
import mongoose, { Model } from 'mongoose';
import Utils from "../Utils";

export default class ChallengeStorage {
  public static async getChallenge(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge> {
    const result = await ChallengeStorage.getChallenges(params);
    return result.length > 0 ? result[0] : null;
  }

  public static async getChallenges(params?: { id?: string | string[], nbSynonyms?: number }): Promise<IChallenge[]> {
    const aggregation = [];
    if (params) {
      if (params.id) {
        aggregation.push({ $match: { _id: Array.isArray(params.id) ? { $in: params.id.map(id => mongoose.Types.ObjectId(id)) } : mongoose.Types.ObjectId(params.id) } });
      }
      if (params.nbSynonyms) {
        aggregation.push({ $match: { allowedTags: { $size: params.nbSynonyms } } })
      }
    }
    Utils.reformatIdField(aggregation);
    Utils.deleteUselessFields(aggregation);
    return Challenge.aggregate(aggregation);
  }

  public static async saveChallenge(challenge: IChallenge) {
    const challengeModel = new Challenge(challenge);
    return await challengeModel.save();
  }

  public static async updateChallenge(challenge: IChallenge) {
    return Challenge.findOneAndUpdate({ '_id': challenge.id }, { $set: challenge }, { useFindAndModify: false });
  }
}
