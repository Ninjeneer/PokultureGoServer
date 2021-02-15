import mongoose, { Schema, Document } from "mongoose";
import config from '../../assets/config.json';

export interface IPOI extends Document {
  location: number[];
  name: string;
  type: string;
  description?: string;
  tags: {
    [properties: string]: any
  };
  challenge: string;
  [properties: string]: any
}

const POISchema: Schema = new Schema({
  location: { type: Array, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String },
  challenge: { type: String },
  tags: { type: Object }
});

export function getPOIType(poi: any) {
  for (const type of config.allowedTypes.map(t => t.name)) {
    if (poi.tags.hasOwnProperty(type)) {
      return type;
    }
  }
  return null;
}
export default mongoose.model<IPOI>('poi', POISchema);
