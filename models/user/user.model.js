const { Schema, model } = require("mongoose");

const schema = new Schema({
  email: {
    type: String,
    // required: true,
  },
  name: {
    type: String,
    // required: true,
  },
  password: {
    type: String,
    // required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  mobileNumber: {
    type: Number,
    // required: true,
  },
  profilePhoto: {
    type: String,
    // required: false,
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
  premium: {
    type: Boolean,
    default: false,
  },
  subscription: {
    type: Boolean,
    default: false,
  },
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
  plan: {
    planId: {
      type: String,
    },
    name: {
      type: String,
    },
    price: {
      type: Number,
    },
  },
  favourites: [{ type: Schema.Types.ObjectId, ref: "Property" }],
  savedProperty: [{ type: Object, required: true }],
});

module.exports = model("UserModel", schema);
