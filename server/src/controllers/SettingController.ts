import { StatusCodes } from "http-status-codes";
import Setting from "../models/Setting";
import SettingStorage from "../storage/SettingStorage";
import { AppError } from "../Types";

export default class SettingController {
  public static async createSetting(key: string, value: string) {
    if (!key) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Setting key is mandatory'
      });
    }
    if (!value) {
      throw new AppError({
        code: StatusCodes.BAD_REQUEST,
        message: 'Setting value is mandatory'
      })
    }

    try {
      await SettingStorage.createSetting(key, value);
    } catch (e) {
      throw new AppError({
        code: StatusCodes.INTERNAL_SERVER_ERROR,
        message: 'Failed to save setting',
        stack: e.stack
      })
    }
  }
}
