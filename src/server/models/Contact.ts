import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  contactMethod: {
    type: String,
    enum: ['email', 'phone'],
    required: true,
  },
  contactValue: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  adminReply: {
    type: String,
  },
  repliedAt: {
    type: Date,
  },
}, { timestamps: true });

contactSchema.index({ createdAt: -1 });
contactSchema.index({ contactValue: 1 });

export default mongoose.models.Contact || mongoose.model('Contact', contactSchema);
