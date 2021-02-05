import Task from "./Task";

import * as through2 from 'through2';
import fs from 'fs';
import mongoose, { Schema } from 'mongoose';
import Database from '../Database';
import config from '../../assets/config.json';
import logupdate from 'log-update';
import POI, { ChallengeType, getPOIType } from '../models/POI'

const parseOSM = require('osm-pbf-parser');

export default class ImportPOITask extends Task {
  constructor() {
    super('ImportPOITask');
  }

  public async canRun(): Promise<boolean> {
    const poisCount = await Database.getClient().collection('pois').countDocuments();
    if (poisCount === 0) {
      await Database.getClient().collection('pois').createIndex({ location: "2dsphere" });
      return true;
    } else {
      console.log(`Found ${poisCount} POIs in database. Skipping importation.`);
      return false;
    }
  }


  public async task() {
    return new Promise((resolve, error) => {
      this.importPOIsFromFile('assets/basse-normandie-latest.osm.pbf').then((nbImported) => {
        console.log(`Successfully imported ${nbImported} POIs !`);
        resolve(nbImported);
      });
    })
  }

  private importPOIsFromFile(path: string) {
    return new Promise((resolve, error) => {
      const parser = parseOSM();
      let imported = 0;
      console.log("Importation started...");
      fs.createReadStream(path, { emitClose: true })
        .on('end', () => resolve(imported))
        .pipe(parser)
        .pipe(through2.obj((chunk, enc, next) => {
          for (const item of chunk) {
            if (!item.lon || !item.lat) {
              continue;
            }
            // Sanitize object
            Database.sanitizeObject(item);
            // Replace default lat and lon attributes by location ojbect
            Object.assign(item, { location: [item.lon, item.lat] });
            delete item.lat;
            delete item.lon;
            // Only save records having a 'tag' attribute with a wanted type
            if (item.tags.name && Object.keys(item.tags).some(tagKey => config.allowedTypes.map(type => type.name).includes(tagKey))) {
              item.name = item.tags.name;
              item.type = getPOIType(item);
              item.challengeType = ChallengeType.PHOTO;
              delete item.tags.name;
              (new POI(item)).save().then(() => logupdate(`Imported POI n°${++imported}`));
            }
          }
          next();
        }));
    });
  }
}
