import mongoose, { Schema, Document } from "mongoose";
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  pseudo: string;
  password: string;
  token?: string;
  avatar?: string;
  scores: IScore[];
  challengesDone: string[];
  distance?: number;
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
  token: { type: String, unique: true },
  avatar: { type: String },
  scores: [ScoreSchema],
  challengesDone: [String]
});

UserSchema.pre("save", function save(next) {
  const user = this as IUser;
  if (!user.isModified("password")) { return next(); }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return next(err); }
    bcrypt.hash(user.password, salt, (err: mongoose.Error, hash) => {
      if (err) { return next(err); }
      user.password = hash;
      next();
    });
  });
});

export async function comparePasswords(p1: string, p2: string): Promise<boolean> {
  return await bcrypt.compare(p1, p2);
}

export default mongoose.model<IUser>('User', UserSchema);
