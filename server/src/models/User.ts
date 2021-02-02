import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    pseudo: string;
    password: string;
    avatar: string;
}

const UserSchema: Schema = new Schema({
    pseudo: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String }
});

export default mongoose.model<IUser>('User', UserSchema);