const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  properties: [
    { type: Schema.Types.ObjectId, ref: "Property", required: true },
  ],
});

module.exports = model("AreaModel", schema);
