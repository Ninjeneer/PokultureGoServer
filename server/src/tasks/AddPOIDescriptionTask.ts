import Task from "./Task";
import ParserFactory from "../module/parser/ParserFactory";
import POIStorage from "../storage/POIStorage";
import getDistance from 'geolib/es/getDistance';

const parseOSM = require('osm-pbf-parser');

enum DescriptionBasedType {
  NAME = 'name',
  COORDINATES = 'coordinates'
}

export default class AddPOIDescriptionTask extends Task {
  constructor() {
    super('AddPOIDescriptionTask');
  }

  public async task() {
    const openDataPois = ParserFactory.createOpenDataCsvParser().parse('assets/datatourisme-nor.csv');
    let nbUpdated = 0;
    console.log("Updating descriptions...");
    for (const openDataPoi of openDataPois) {
      // Skip POI from OpenData without description
      if (!openDataPoi.description) {
        continue;
      }
      // Try to find POI by name
      let descriptionBasedType = DescriptionBasedType.NAME;
      let poi = await POIStorage.getPOI({ name: openDataPoi.name });
      if (!poi) {
        // If POI could not be find by name, try to match with coordinates
        poi = (await POIStorage.getPOIs({ near: true, latitude: openDataPoi.latitude, longitude: openDataPoi.longitude, range: 30 }))[0];
        descriptionBasedType = DescriptionBasedType.COORDINATES;
      }
      // Do not update POIs having already a description based by name (More accurate than coordinates)
      if (poi && poi.description && poi.descriptionBasedType === DescriptionBasedType.NAME) {
        continue;
      }
      // POI without description found
      if (poi && getDistance({ latitude: poi.location[1], longitude: poi.location[0] }, { latitude: openDataPoi.latitude, longitude: openDataPoi.longitude }) <= 30) {
        poi.description = openDataPoi.description;
        poi.descriptionBasedType = descriptionBasedType;
        await POIStorage.updatePOI(poi);
        nbUpdated++;
      }
    }
    console.log(`Updated ${nbUpdated} descriptions`);
  }
}
