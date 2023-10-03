const { Schema, model } = require("mongoose");

const schema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  leads: [
    {
      userId: {
        type: String,
      },
      agentId: {
        type: String,
      },
      propertyId: {
        type: Schema.Types.ObjectId,
        ref: "Property",
      },
      agentName: {
        type: String,
      },
      userName: {
        type: String,
      },
      userEmail: {
        type: String,
      },
      userMobile: {
        type: Number,
      },
      propertyName: {
        type: String,
      },
    },
  ],
  plans: [
    {
      userId: {
        type: String,
      },
      planId: {
        type: String,
      },
      paid: {
        type: Boolean,
        default: false,
      },
      userName: {
        type: String,
      },
      userEmail: {
        type: String,
      },
      leadCount: {
        type: Number,
      },
      planName: {
        type: String,
      },
      price: {
        type: Number,
      },
      screenshot: [
        {
          type: String,
        },
      ],
    },
  ],
  careServiceRequest: [
    {
      userId: {
        type: Schema.Types.ObjectId, // Reference to the User model
        ref: "User", // The model name to reference
      },
      propertyId: {
        type: Schema.Types.ObjectId, // Reference to the Property model
        ref: "Property", // The model name to reference
      },
    },
  ],
});

module.exports = model("AdminModel", schema);
