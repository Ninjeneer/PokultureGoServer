import Task from "./Task";

import * as through2 from 'through2';
import fs from 'fs';
import mongoose, { Schema } from 'mongoose';
import Database from '../Database';
import config from '../../assets/config.json'
import * as parse from 'csv-parse/lib/sync'
import ParserFactory from "../module/parser/ParserFactory";

const parseOSM = require('osm-pbf-parser');

export default class ImportPOITask extends Task {
  constructor() {
    super('ImportPOITask');
  }

  public async task() {
    return new Promise((resolve, error) => {
      Database.getClient().collection('pois').countDocuments().then((poisCount) => {
        if (poisCount === 0) {
          console.log("No POIs found in DB. Importing...");
          Database.getClient().collection('pois').createIndex({ location: "2dsphere" }).then(() => {
            this.importPOIsFromFile('assets/basse-normandie-latest.osm.pbf');
            resolve(null);
          });
        } else {
          console.log(`Found ${poisCount} POIs in database. Skipping importation.`);
          resolve(null);
        }
      });
    });
  }

  private importPOIsFromFile(path: string) {
    const parser = parseOSM();
    let imported = 0;
    const POI = mongoose.model('POI', new Schema({}, { strict: false }));
    fs.createReadStream(path)
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
          if (Object.keys(item.tags).some(tagKey => config.allowedTypes.map(type => type.name).includes(tagKey))) {
            (new POI(item)).save().then(() => {
              console.log(`Document n°${++imported} imported`);
            });
          }
        }
        next();
      }));
  }
}
