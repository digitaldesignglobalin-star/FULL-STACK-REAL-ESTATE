import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: String,
  mobile: {
    // ✅ ADD THIS
    type: String,
  },
  otp: {
    type: String,
    required: true,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    enum: ["user", "builder", "employee", "admin"],
    default: "user",
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 },
  },
  attempts: {
    type: Number,
    default: 0,
  },
});

export default mongoose.models.Otp || mongoose.model("Otp", otpSchema);
