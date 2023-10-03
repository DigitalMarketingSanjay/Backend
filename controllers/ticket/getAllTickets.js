const ticketModel = require("../../models/ticket/ticket.model");

const getAllTickets = async (req, res) => {
  try {
    const tickets = await ticketModel.find({}).sort({ _id: -1 });
    res.status(200).send({
      success: true,
      message: "tickets fetched successfully",
      tickets: tickets,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = getAllTickets;
