import mongoose, { Schema, Document } from "mongoose";

export enum ChallengeType {
  PHOTO = 'photo'
}

export interface IChallenge extends Document {
  type: string;
  allowedTags?: string[]; // Photo challenge related : image recognition predictions
  score: number;
}

const ChallengeSchema: Schema = new Schema({
  type: { type: String, required: true },
  allowedTags: { type: Array },
  score: { type: Number }
});

export default mongoose.model<IChallenge>('challenge', ChallengeSchema);
