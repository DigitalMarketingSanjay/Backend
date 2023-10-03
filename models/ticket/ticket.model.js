const { Schema, model } = require("mongoose");

const schema = new Schema({
  userId: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  tittle: { type: String },
  message: { type: String },
  ticketStatus: {
    type: String,
    enum: ["open", "close"],
    required: true,
    default: "open",
  },
});

module.exports = model("TicketModel", schema);
