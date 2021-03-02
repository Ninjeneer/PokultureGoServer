import Database from "../Database";
import config from '../../assets/config.json'
import POI, { IPOI } from "../models/POI";
import mongoose from 'mongoose';
import Utils from "../Utils";

export default class POIStorage {
  public static async getPOI(params?: { id?: string, name?: string, near?: boolean, latitude?: number, longitude?: number, range?: number, type?: string[], challengeID?: string }): Promise<IPOI> {
    const result = await POIStorage.getPOIs(params);
    return result.length > 0 ? result[0] : null;
  }

  public static async getPOIs(params?: { id?: string, name?: string, near?: boolean, latitude?: number, longitude?: number, range?: number, type?: string[], challengeID?: string }): Promise<IPOI[]> {
    const aggregation = [];
    if (params) {
      if (params.id) {
        aggregation.push({ $match: { _id: mongoose.Types.ObjectId(params.id) } });
      }
      if (params.name) {
        aggregation.push({ $match: { name: params.name } });
      }
      if (params.near && params.latitude && params.longitude && params.range) {
        aggregation.push({
          $geoNear: {
            near: { type: "Point", coordinates: [params.longitude, params.latitude] },
            distanceField: "distance",
            maxDistance: params.range,
            spherical: true
          }
        });
      }
      // if (params.type) {
      //   const or = [];
      //   for (const type of config.allowedTypes.map(t => t.name)) {
      //     or.push({ [`tags.${type}`]: { $in: params.type } });
      //   }
      //   aggregation.push({ $or: or });
      // }
      if (params.challengeID) {
        aggregation.push({ $match: { challenge: params.challengeID } });
      }
    }
    Utils.reformatIdField(aggregation);
    Utils.deleteUselessFields(aggregation);
    return POI.aggregate(aggregation);
  }

  public static async updatePOI(poi: any) {
    return POI.findOneAndUpdate({ '_id': poi._id }, { $set: poi }, { useFindAndModify: false });
  }
}
