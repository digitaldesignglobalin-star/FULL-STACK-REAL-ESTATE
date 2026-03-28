import mongoose from "mongoose";

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password?: string;
  mobile?: string;
  role: "user" | "builder" | "employee" | "admin";
  isApproved: boolean;
  isBlocked: boolean;
  image?: string;
  hasSubscription: boolean;
  subscriptionExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
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
    },

    mobile: {
      type: String,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "builder", "employee", "admin"],
      default: "user",
    },

    isApproved: {
      type: Boolean,
      default: true,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    image: {
      type: String,
    },

    hasSubscription: {
      type: Boolean,
      default: false,
    },

    subscriptionExpiry: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isBlocked: 1 });
userSchema.index({ hasSubscription: 1 });
userSchema.index({ subscriptionExpiry: 1 });

const User = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
