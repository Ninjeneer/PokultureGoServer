import Task from "./Task";
import logupdate from 'log-update';
import POIStorage from "../storage/POIStorage";
import SynonymFactory from "../modules/synonyms/SynonymFactory";
import ChallengeStorage from "../storage/ChallengeStorage";
import SettingStorage, { SettingKey } from "../storage/SettingStorage";
import Utils from "../Utils";

const parseOSM = require('osm-pbf-parser');

export default class AddPhotoChallengesSynonyms extends Task {
  constructor() {
    super('AddPhotoChallengesSynonyms');
  }

  public async canRun(): Promise<boolean> {
    const setting = await SettingStorage.getSettingByKey(SettingKey.RUN_TASK_ADD_CHALLENGES_PHOTO_SYNONYMS);
    if (setting) {
      return Utils.parseBoolean(setting.value);
    } else {
      return true;
    }
  }


  public async task() {
    const challenges = await ChallengeStorage.getChallenges();
    const synonym = SynonymFactory.createThesaurus();
    for (const challenge of challenges) {
      const poi = await POIStorage.getPOI({ challengeID: challenge.id.toString() });
      // Handle types having format XXXX_XXXXX
      for (const subType of poi.tags[poi.type].split("_")) {
        challenge.allowedTags.push(...await synonym.getSynonymsOf(subType));
      }
      await ChallengeStorage.updateChallenge(challenge);
      if (challenge.allowedTags.length > 1) {
        // Avoid logging for single word
        logupdate(`Updated challenge ${challenge.id} with ${challenge.allowedTags.length} synonyms`);
      }
    }
    const setting = await SettingStorage.getSettingByKey(SettingKey.RUN_TASK_ADD_CHALLENGES_PHOTO_SYNONYMS);
    if (setting) {
      await SettingStorage.updateSetting(SettingKey.RUN_TASK_ADD_CHALLENGES_PHOTO_SYNONYMS, false);
    } else {
      await SettingStorage.createSetting(SettingKey.RUN_TASK_ADD_CHALLENGES_PHOTO_SYNONYMS, false);
    }
  }
}
