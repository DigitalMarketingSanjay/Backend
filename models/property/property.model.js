const { Schema, model } = require("mongoose");

const schema = new Schema({
  agentId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    //  required: true
  },
  newAgentId: { type: Schema.Types.ObjectId, ref: "User" },
  name: {
    type: String,
    required: true,
  },
  toggle: {
    type: String,
  },
  userType: {
    type: String,
  },
  authority: {
    type: String,
  },
  buildingType: {
    //residential, commercial
    type: String,
    // required: true,
  },
  cost: {
    type: Number,
    required: true,
  },
  // propertyType : PG, Villa , Apartment
  propertyType: {
    type: String,
    // required: true,
  },
  size: {
    type: Number,
    // required: true,
  },
  //added now.....
  BHKconfig: {
    type: String,
    // required: true,
  },
  areaValue: {
    type: String,
    default: null,
  },
  areaType: {
    type: String,
    default: null,
  },
  amenities: [{ type: String, required: true }],
  coordinates: {
    lat: {
      type: Number,
    },
    lng: {
      type: Number,
    },
  },
  location: {
    name: { type: String },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      // required: true,
    },
  },
  area: {
    name: {
      type: String,
      // required: true,
    },
    areaId: {
      type: Schema.Types.ObjectId,
      ref: "Area",
      // required: true,
    },
  },
  address: {
    type: String,
    // required: true,
  },

  //..............................
  //........
  availableFor: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    // required: true,
  },
  //featured boolean
  featured: {
    type: Boolean,
    default: false,
  },
  liftFacility: {
    type: String,
  },
  additionalRooms: {
    type: String,
  },
  possessionStatus: {
    type: String,
  },
  furnishingStatus: {
    type: String,
  },
  ageOfProperty: {
    type: String,
  },
  numOfBathroom: {
    type: String,
  },
  numOfParking: {
    type: String,
  },
  view: {
    type: String,
  },
  facing: {
    type: String,
  },
  floorNo: {
    type: String,
  },
  towerBlock: {
    type: String,
  },
  floorCount: {
    type: String,
  },
  unitNo: {
    type: String,
  },
  //agent profile:
  agentProfile: [
    {
      type: String,
      //  required: true
    },
  ],
  primaryImage: {
    type: String,
  },
  propertyImages: [
    {
      type: String,
      //  required: true
    },
  ],
  purchaseRequests: [
    { type: Schema.Types.ObjectId, ref: "PurchaseRequest", required: true },
  ],
  createdAt: { type: Date, default: Date.now },
  slug: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
  },
  careService: {
    type: Boolean,
    default: false,
  },
  metaTittle: {
    type: String,
  },
  metaDescription: {
    type: String,
  },
  propertyTags: [
    {
      type: String,
      //  required: true
    },
  ],
});

module.exports = model("PropertyModel", schema);
