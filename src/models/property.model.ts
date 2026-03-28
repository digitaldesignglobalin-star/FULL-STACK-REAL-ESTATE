import mongoose from "mongoose";

export interface IProperty extends mongoose.Document {
  purpose?: string;
  category?: string;
  type?: string;
  city?: string;
  locality?: string;
  bhk?: number;
  bed?: string;
  bath?: string;
  bal?: string;
  furnish?: string;
  age?: string;
  tenant?: string;
  broker?: string;
  area?: number;
  areaUnit?: string;
  availableFrom?: string;
  price?: number;
  pricePerSqft?: number;
  deposit?: string;
  maintenance?: string;
  description?: string;
  ownership?: string;
  negotiable?: string;
  maintenanceType?: string;
  images: string[];
  video?: string;
  youtube?: string;
  status: "new" | "launched" | "ready" | "under-construction" | "pending" | "rejected";
  postedBy?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new mongoose.Schema<IProperty>(
  {
    purpose: { type: String, trim: true },
    category: String,
    type: { type: String, trim: true },

    city: { type: String, trim: true },
    locality: { type: String, trim: true },

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

    price: Number,
    pricePerSqft: Number,
    deposit: String,
    maintenance: String,
    description: String,

    ownership: String,
    negotiable: String,
    maintenanceType: String,

    images: {
      type: [String],
      default: [],
    },
    video: String,
    youtube: String,

    status: {
      type: String,
      enum: ["new", "launched", "ready", "under-construction", "pending", "rejected"],
      default: "pending",
    },

    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

PropertySchema.index({ status: 1 });
PropertySchema.index({ city: 1 });
PropertySchema.index({ postedBy: 1 });
PropertySchema.index({ createdAt: -1 });

export default mongoose.models.Property ||
  mongoose.model<IProperty>("Property", PropertySchema);
