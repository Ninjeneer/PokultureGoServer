import Database from "../Database";
import config from '../../assets/config.json'
import POI, { IPOI } from "../models/POI";
import mongoose from 'mongoose';

export default class POIStorage {
  public static async getPOI(params?: { id?: string, name?: string, near?: boolean, latitude?: number, longitude?: number, range?: number, type?: string[], challengeID?: string }): Promise<IPOI> {
    const result = await POIStorage.getPOIs(params);
    return result.length > 0 ? result[0] : null;
  }

  public static async getPOIs(params?: { id?: string, name?: string, near?: boolean, latitude?: number, longitude?: number, range?: number, type?: string[], challengeID?: string }): Promise<IPOI[]> {
    const query = {};
    if (params) {
      if (params.id) {
        Object.assign(query, { _id: mongoose.Types.ObjectId(params.id) });
      }
      if (params.name) {
        Object.assign(query, {name: params.name });
      }
      if (params.near && params.latitude && params.longitude && params.range) {
        Object.assign(query, {
          location: {
            $near: {
              $geometry: { type: "Point", coordinates: [params.longitude, params.latitude] },
              $minDistance: 0,
              $maxDistance: params.range
            }
          }
        });
      }
      if (params.type) {
        const or = [];
        for (const type of config.allowedTypes.map(t => t.name)) {
          or.push({ [`tags.${type}`]: { $in: params.type } });
        }
        Object.assign(query, { $or: or });
      }
      if (params.challengeID) {
        Object.assign(query, { challenge: params.challengeID });
      }
    }
    return POI.find(query);
  }

  public static async updatePOI(poi: any) {
    return POI.findOneAndUpdate({ '_id': poi._id }, { $set: poi }, { useFindAndModify: false });
  }
}
