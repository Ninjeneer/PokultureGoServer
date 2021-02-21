import config from '../assets/config.json'
import { IUser } from './models/User';

export default class Utils {
  public static buildAllTypesArray(): string[] {
    const types = [];
    for (const type of config.allowedTypes) {
      types.push(...type.values)
    }
    return types;
  }

  public static parseBoolean(s: string): boolean {
    return s.toLowerCase() === 'true';
  }

  public static hideUserPassword(u: IUser): IUser {
    const user = {...u['_doc']} as IUser;
    delete user.password;
    return user;
  }

  public static buildServerURL(): string {
    return 'http://localhost:8080';
  }
}
