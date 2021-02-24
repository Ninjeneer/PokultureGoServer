import User, { comparePasswords, IUser } from "../models/User";
import StatusCodes from 'http-status-codes';
import { AppError } from "../Types";
import UserStorage from "../storage/UserStorage";
import jwt from 'jsonwebtoken';
import config from '../../assets/config.json'
import Utils from "../Utils";

export default class UserController {
  public static async checkToken(req, next: (...any) => any): Promise<void> {
    // Get the jwt token from the head
    // Try to validate the token and get data
    if (!req.headers['authorization']) {
      throw new AppError({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Authorization token is missing'
      });
    }

    try {
      const token = req.headers['authorization'].split(' ')[1];
      jwt.verify(token, config.jwtSecretKey);
      const user = await UserStorage.getUserByToken(token);
      if (user) {
        Object.assign(req, { user });
      } else {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED
        });
      }
    } catch (error) {
      // If token is not valid, respond with 401 (unauthorized)
      throw new AppError({
        code: StatusCodes.UNAUTHORIZED,
        message: 'Failed to parse authorization token'
      });
    }
    // Call the next middleware or controller
    next();
  }

  public static async registerUser(pseudo: IUser['pseudo'], password: IUser['password'], avatar: IUser['avatar']): Promise<IUser> {
    if (!pseudo || !password) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Missing field'
      })
    }
    try {
      let user = new User({ pseudo, password, avatar, scores: [] });
      const token = jwt.sign({ id: user.id, pseudo: user.pseudo }, config.jwtSecretKey);
      user.token = token;
      user = await user.save();
      console.log(`User ${JSON.stringify(user)} registered`);

      delete user.password;
      return user;
    } catch (e) {
      if (e.code === 11000) {
        throw new AppError({
          code: StatusCodes.CONFLICT,
          message: 'User already exists',
        })
      } else {
        throw e;
      }
    }
  }

  public static async loginUser(pseudo?: IUser['pseudo'], password?: IUser['password'], token?: IUser['token']): Promise<IUser> {
    if ((!pseudo || !password) && !token) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Missing field'
      })
    }
    // Login via credentials
    let user: IUser;
    if (pseudo && password) {
      user = await UserStorage.getUserByPseudo(pseudo);
      if (!user || !(await comparePasswords(password, user.password))) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          message: 'Invalid pseudo or password'
        });
      }
      user.token = jwt.sign({ id: user.id, pseudo: user.pseudo }, config.jwtSecretKey);
      try {
        await UserStorage.updateUser(user);
      } catch (e) {
        throw new AppError({
          message: 'Failed to update user token in DB',
          stack: e.stack
        })
      }
    } else {
      // Login via token
      user = await UserStorage.getUserByToken(token);
      if (!user) {
        throw new AppError({
          code: StatusCodes.UNAUTHORIZED,
          message: 'Cannot find user with given token'
        })
      }
    }
    return Utils.hideUserPassword(user);
  }
}
