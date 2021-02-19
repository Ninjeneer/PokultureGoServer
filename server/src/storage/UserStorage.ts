import User, { IScore, IUser } from "../models/User";

export default class UserStorage {
  public static async getUsersScores(params?: { city: IScore['city'] }): Promise<IUser[]> {
    const aggregation = [];
    aggregation.push({ '$project': { '_id': 1, 'pseudo': 1, 'scores': 1 }});
    if (params) {
      if (params.city) {
        aggregation.push({ '$match': { 'scores.city': params.city }});
      }
    }

    return User.aggregate(aggregation);
  }}
