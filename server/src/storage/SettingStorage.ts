import Setting, { ISetting } from "../models/Setting";

export enum SettingKey {
  RUN_TASK_ADD_POI_DESCRIPTION = 'runTaskAddPOIDescription',
  RUN_TASK_ADD_CHALLENGES_PHOTO_SYNONYMS = 'runTaskAddPhotoChallengesSynonyms'
}


export default class SettingStorage {
  public static async createSetting(key: string, value: any) {
    const setting = new Setting({ key, value });
    setting.save();
  }

  public static async getSettings(): Promise<ISetting[]> {
    return Setting.find();
  }

  public static async getSettingByKey(key: string): Promise<ISetting> {
    return Setting.findOne({ key });
  }

  public static async updateSetting(key: string, value: string) {
    return Setting.findOneAndUpdate({ key }, { $set: { key, value }});
  }
}
