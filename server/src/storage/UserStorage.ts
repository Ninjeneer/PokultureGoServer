import User, { IScore, IUser } from "../models/User";

export default class UserStorage {
  public static async getUsersScores(params?: { city: IScore['city'] }): Promise<IUser[]> {
    const aggregation = [];
    aggregation.push({ '$project': { '_id': 1, 'pseudo': 1, 'scores': 1 } });
    if (params) {
      if (params.city) {
        aggregation.push({ '$match': { 'scores.city': params.city } });
      }
    }

    return User.aggregate(aggregation);
  }

  public static async getUsers(params?: { pseudo?: string, token?: string }): Promise<IUser[]> {
    const query = {}
    if (params) {
      if (params.pseudo) {
        Object.assign(query, { pseudo: params.pseudo });
      }
      if (params.token) {
        Object.assign(query, { token: params.token });
      }
    }
    return User.find(query);
  }

  public static async getUserByToken(token: string): Promise<IUser> {
    const result = await UserStorage.getUsers({ token });
    return result.length > 0 ? result[0] : null;
  }

  public static async getUserByPseudo(pseudo: string): Promise<IUser> {
    return User.findOne({ pseudo });
  }

  public static async updateUser(user: IUser): Promise<IUser> {
    return await User.findOneAndUpdate({ '_id': user.id }, { $set: user }, { useFindAndModify: false });
  }
}
