import mongoose, { Schema, Document } from "mongoose";

export interface UserDocument extends Document {
    name: string;
    email: string;
    passwordHash: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true }
},
    { timestamps: true }
);

export default mongoose.model<UserDocument>("User", userSchema);

