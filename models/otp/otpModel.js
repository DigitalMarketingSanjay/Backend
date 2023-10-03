const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
  {
    mobileNumber: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: { type: Date, default: Date.now, index: { expires: 300 } },

    // After 5 minutes it deleted automatically from the database
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("OtpModel", otpSchema);
