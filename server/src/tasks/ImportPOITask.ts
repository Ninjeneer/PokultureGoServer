import Task from "./Task";

import * as through2 from 'through2';
import fs from 'fs';
import mongoose, { Schema } from 'mongoose';
import Database from '../Database';
import config from '../../assets/config.json'

const parseOSM = require('osm-pbf-parser');

export default class ImportPOITask implements Task {
  public run() {
    Database.getClient().collection('pois').countDocuments().then((poisCount) => {
      if (poisCount === 0) {
        console.log("No POIs found in DB. Importing...");
        Database.getClient().collection('pois').createIndex({ location: "2dsphere" }).then(() => {
          this.importPOIsFromFile('assets/basse-normandie-latest.osm.pbf');
        });
      } else {
        console.log(`Found ${poisCount} POIs in database. Skipping importation.`);
      }
    });
  }

  private importPOIsFromFile(path: string) {
    const parser = parseOSM();
    let imported = 0;
    const POI = mongoose.model('POI', new Schema({}, { strict: false }));
    const stream = fs.createReadStream(path)
      .pipe(parser)
      .pipe(through2.obj((chunk, enc, next) => {
        for (const item of chunk) {
          if (!item.lon || !item.lat) {
            continue;
          }
          Database.sanitizeObject(item);
          Object.assign(item, { location: [item.lon, item.lat] });
          delete item.lat;
          delete item.lon;
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
