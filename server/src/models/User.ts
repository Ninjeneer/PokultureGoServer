import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  pseudo: string;
  password: string;
  avatar?: string;
  scores: IScore[];
}

export interface IScore {
  city: string;
  score: number;
}

const ScoreSchema: Schema = new Schema({
  city: { type: String, require: true },
  score: { type: Number }
});

const UserSchema: Schema = new Schema({
  pseudo: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  scores: [ScoreSchema]
});

export default mongoose.model<IUser>('User', UserSchema);
