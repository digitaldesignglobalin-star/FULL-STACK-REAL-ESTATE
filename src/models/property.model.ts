import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  // ===== BASIC =====
  purpose: { type: String, trim: true },
  category: String,
  type: { type: String, trim: true },

  // ===== LOCATION =====
  city: { type: String, trim: true },
  locality: { type: String, trim: true },

  // ===== PROFILE =====
  bhk: Number,
  bed: String,
  bath: String,
  bal: String,
  furnish: String,
  age: String,
  tenant: String,
  broker: String,

  area: Number,
  areaUnit: String,
  availableFrom: String,

  // ===== PRICING =====
  // price: { type: Number, trim: true },
  price: Number,
  pricePerSqft: Number,
  deposit: String,
  maintenance: String,
  description: String,

  ownership: String,
  negotiable: String,
  maintenanceType: String,

  // ===== MEDIA =====

  images: {
    type: [String],
    default: [],
  }, // cloudinary URLs
  video: String, // cloudinary URL
  youtube: String,

  // =====STATUS======

  status: {
    type: String,
    enum: ["new", "launched", "ready", "under-construction"],
    default: "new",
  },

  // ===== SYSTEM =====

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Property ||
  mongoose.model("Property", PropertySchema);
