const { Schema, model } = require("mongoose");

const schema = new Schema({
  tittle: { type: String, required: true },
  blogImage: [{ type: String }],
  description: { type: String, required: true },
  metaDescription: { type: String, required: true },
  tags: [{ type: String, required: true }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = model("BlogModel", schema);
