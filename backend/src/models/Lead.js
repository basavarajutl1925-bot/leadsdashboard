const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    message: {
      type: String,
      trim: true,
      default: ''
    },
    source: {
      type: String,
      enum: ['instagram', 'facebook', 'whatsapp', 'direct', 'email', 'phone', 'website'],
      default: 'direct'
    },
    city: {
      type: String,
      default: 'Unknown'
    },
    country: {
      type: String,
      default: 'Unknown'
    },
    location: {
      city: String,
      country: String,
      ipAddress: String
    },
    messageSid: {
      type: String,
      sparse: true,
      unique: true
    },
    messageStatus: {
      type: String,
      enum: ['sent', 'delivered', 'failed', 'pending', 'queued'],
      default: 'pending'
    },
    messageError: String,
    messageSentAt: Date,
    messageDeliveredAt: Date,
    notes: String,
    status: {
      type: String,
      enum: ['new', 'contacted', 'qualified', 'lost', 'converted'],
      default: 'new'
    }
  },
  {
    timestamps: true
  }
);

// Index for better query performance
leadSchema.index({ source: 1, createdAt: -1 });
leadSchema.index({ email: 1 });
leadSchema.index({ phone: 1 });

module.exports = mongoose.model('Lead', leadSchema);
