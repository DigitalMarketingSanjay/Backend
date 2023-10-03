const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    // required: true,
  },
  service: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("contactModel", contactSchema);
