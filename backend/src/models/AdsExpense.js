const mongoose = require('mongoose');

const adsExpenseSchema = new mongoose.Schema(
  {
    platform: {
      type: String,
      enum: ['Instagram', 'Facebook', 'LinkedIn', 'Other'],
      required: true,
      trim: true
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01
    },
    date: {
      type: Date,
      required: true
    },
    notes: {
      type: String,
      trim: true,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

adsExpenseSchema.index({ platform: 1, date: -1 });
adsExpenseSchema.index({ date: -1 });

module.exports = mongoose.model('AdsExpense', adsExpenseSchema);
