const { Schema, model } = require("mongoose");

const schema = new Schema({
  type: { type: String, required: true, enum: ["Company", "Agent"] },
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobileNumber: {
    type: Number,
    required: true,
  },
  profilePhoto: {
    type: String,
    required: false,
  },
  notifications: [
    {
      tittle: {
        type: String,
      },
      description: {
        type: String,
      },
    },
  ],
  leadCount: {
    type: Number,
    default: 10,
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
        type: String,
      },
      userName: {
        type: String,
      },
      userEmail: {
        type: String,
      },
      propertyName: {
        type: String,
      },
    },
  ],
  properties: [
    { type: Schema.Types.ObjectId, ref: "Property", required: true },
  ],
});

module.exports = model("AgentModel", schema);
