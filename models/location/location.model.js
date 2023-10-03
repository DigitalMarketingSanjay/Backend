const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  areas: [{ type: Schema.Types.ObjectId, ref: "Area", required: true }],
  locationImages: [{ type: String }],
});

module.exports = model("LocationModel", schema);
