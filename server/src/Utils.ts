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

  public static isEmptyObject(obj: any): boolean {
    return JSON.stringify({}) === JSON.stringify(obj);
  }

  public static locations(locations: number[]): { longitude: number, latitude: number } {
    return { longitude: locations[0], latitude: locations[1] };
  }

  /**
   * Replace mongo DB _id by id in query results
   */
  public static reformatIdField(aggregation: {}[]) {
    aggregation.push({ $addFields: { id: "$_id" } });
    aggregation.push({ $unset: "_id" });
  }
}
