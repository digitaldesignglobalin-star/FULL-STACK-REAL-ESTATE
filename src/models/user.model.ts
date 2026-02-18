import mongoose from "mongoose";

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "broker" | "builder" | "employe" | "admin";
  //  isApproved?: boolean;
  //   isBlocked?: boolean;
  image?: string
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: false,
    },

    mobile: {
      type: String,
      required: false,
      unique:true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "broker", "builder", "employe", "admin"],
      default: "user",
    },

    // "user" | "broker" | "builder" | "employe" | "admin"

    //   isApproved: {
    //       type: Boolean,
    //       default: false,
    //     },

    //     isBlocked: {
    //       type: Boolean,
    //       default: false,
    //     },

    image: {
type : String
    }
  },
  { timestamps: true },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
