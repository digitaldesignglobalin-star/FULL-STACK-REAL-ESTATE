import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
  },
  password: String,
  otp: {
    type: String,
    required: true,
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
