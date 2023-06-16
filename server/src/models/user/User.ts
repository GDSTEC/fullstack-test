import mongoose from "mongoose";
import { IUserModel } from "./interfaceIUserModel";

const UserModelSchema = new mongoose.Schema<IUserModel>({
  userName: {
    type: String,
    required: true,
    minlength: 2,
  },

  userEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match:
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  },
  userPassword: {
    type: String,
    required: true,
    minlength: 8,
  },

});

const User = mongoose.model<IUserModel>("User", UserModelSchema);
export default User;