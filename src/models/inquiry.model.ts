import mongoose from "mongoose";

export interface IInquiry extends mongoose.Document {
  propertyId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  createdAt: Date;
}

const InquirySchema = new mongoose.Schema<IInquiry>({
  propertyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Property",
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  message: String,
}, { timestamps: true });

export default mongoose.models.Inquiry || 
  mongoose.model<IInquiry>("Inquiry", InquirySchema);