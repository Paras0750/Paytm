import mongoose, { Mongoose, Schema, mongo } from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// connect mongodb throw error if not ttrue
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err: Error) => {
    console.log("Error: ", err);
  });

export interface IUser extends Document {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minLength: 3,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  firstName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
    maxLength: 50,
  },
});

export const User = mongoose.model<IUser>("Users", userSchema);
