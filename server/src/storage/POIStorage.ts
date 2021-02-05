import Database from "../Database";
import config from '../../assets/config.json'
import mongoose, { isValidObjectId } from "mongoose";
import POI from "../models/POI";

export default class POIStorage {
  public static async getPOI(params?: { name?: string, location?: [number, number] }) {
    const query = {};
    if (params) {
     Object.assign(query, {name: params.name });
    }
    return await Database.getClient().collection('pois').findOne(query);
  }

  public static async getPOIs(params?: { near?: boolean, latitude?: number, longitude?: number, range?: number, type?: string[] }) {
    const query = {};
    if (params) {
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
    }
    return POI.find(query);
  }

  public static async updatePOI(poi: any) {
    return POI.findOneAndUpdate({ '_id': poi._id }, { $set: poi }, { useFindAndModify: false });
  }
}