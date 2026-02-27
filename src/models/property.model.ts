import mongoose from "mongoose";

const PropertySchema = new mongoose.Schema({
  // ===== BASIC =====
  purpose: String,
  category: String,
  type: String,

  // ===== LOCATION =====
  city: String,
  locality: String,

  // ===== PROFILE =====
  bhk: String,
  bed: String,
  bath: String,
  bal: String,
  furnish: String,
  age: String,
  tenant: String,
  broker: String,

  area: String,
  areaUnit: String,
  availableFrom: String,

  // ===== PRICING =====
  price: String,
  deposit: String,
  maintenance: String,
  description: String,

  ownership: String,
  negotiable: String,
  maintenanceType: String,

  // ===== MEDIA =====

  images: [String], // cloudinary URLs
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
