const { Schema, model } = require("mongoose");

const schema = new Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  tags: [{ type: String, required: true }],
  numOfLeads: { type: Number, required: true },
  text: { type: String, required: true },
});

module.exports = model("PlanModel", schema);
