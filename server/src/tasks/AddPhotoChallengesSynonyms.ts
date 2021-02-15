import Task from "./Task";

import * as through2 from 'through2';
import fs from 'fs';
import Database from '../Database';
import config from '../../assets/config.json';
import logupdate from 'log-update';
import POI, { getPOIType } from '../models/POI'
import Challenge, { ChallengeType, IChallenge } from "../models/Challenge";
import mongoose from "mongoose";
import POIStorage from "../storage/POIStorage";
import SynonymFactory from "../modules/synonyms/SynonymFactory";
import ChallengeStorage from "../storage/ChallengeStorage";
import SettingStorage, { SettingKey } from "../storage/SettingStorage";
import Utils from "../Utils";
import Setting from "../models/Setting";

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
      const poi = await POIStorage.getPOI({ challengeID: challenge.id });
      for (const subType of poi.tags[poi.type].split("_")) {
        challenge.allowedTags.push(...await synonym.getSynonymsOf(subType));
      }
      await challenge.save();
      if (challenge.allowedTags.length > 1) {
        // Avoid logging for single word
        logupdate(`Updated challenge ${challenge.id} with ${challenge.allowedTags.length} synonyms`);
      }
    }
  }
}
