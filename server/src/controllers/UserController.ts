import User, { IUser } from "../models/User";
import StatusCodes from 'http-status-codes';
import { AppError } from '../Types'

export default class UserController {
  public static async registerUser(pseudo: IUser['pseudo'], password: IUser['password'], avatar: IUser['avatar']): Promise<IUser> {
    if (!pseudo || !password) {
      throw new Error("Missing field !");
    }
    try {
      let user = new User({ pseudo, password, avatar });
      user = await user.save();
      console.log(`User ${JSON.stringify(user)} registered`);

      delete user.password;
      return user;
    } catch (e) {
      if (e.code === 11000) {
        throw new AppError({
          code: StatusCodes.CONFLICT,
          message: `User ${pseudo} already exists`
        });
      } else {
        throw e;
      }
    }
  }
}
