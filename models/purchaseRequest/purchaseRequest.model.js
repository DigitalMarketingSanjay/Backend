const { Schema, model } = require("mongoose");

const schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  agent: { type: Schema.Types.ObjectId, ref: "Agent", required: true },
  property: { type: Schema.Types.ObjectId, ref: "Property", required: true },
  message: { type: String, required: false },
});

module.exports = model("PurchaseRequestModel", schema);
