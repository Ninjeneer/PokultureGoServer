import User, { IScore, IUser } from "../models/User";
import Utils from "../Utils";

export default class UserStorage {
  public static async getUsersScores(params?: { city: IScore['city'] }): Promise<IUser[]> {
    const aggregation = [];
    aggregation.push({ '$project': { '_id': 1, 'pseudo': 1, 'scores': 1 } });
    if (params) {
      if (params.city) {
        aggregation.push({ '$match': { 'scores.city': params.city } });
      }
    }
    Utils.reformatIdField(aggregation);
    Utils.deleteUselessFields(aggregation);
    return User.aggregate(aggregation);
  }

  public static async getUsers(params?: { pseudo?: string, token?: string }): Promise<IUser[]> {
    const aggregation = []
    if (params) {
      if (params.pseudo) {
        aggregation.push({ $match: { pseudo: params.pseudo } });
      }
      if (params.token) {
        aggregation.push({ $match: { token: params.token } });
      }
    }
    Utils.reformatIdField(aggregation);
    Utils.deleteUselessFields(aggregation);
    return User.aggregate(aggregation);
  }

  public static async getUserByToken(token: string): Promise<IUser> {
    const result = await UserStorage.getUsers({ token });
    return result.length > 0 ? result[0] : null;
  }

  public static async getUserByPseudo(pseudo: string): Promise<IUser> {
    const res = await UserStorage.getUsers({ pseudo });
    return res.length > 0 ? res[0] : null;
  }

  public static async updateUser(user: IUser): Promise<IUser> {
    return await User.findOneAndUpdate({ '_id': user.id }, { $set: user }, { useFindAndModify: false });
  }
}
