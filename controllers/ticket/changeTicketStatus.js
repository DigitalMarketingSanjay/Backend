const ticketModel = require("../../models/ticket/ticket.model");

const changeTicketStatus = async (req, res) => {
  try {
    const { ticketId, ticketStatus } = req.body;
    const ticket = await ticketModel.findById({ _id: ticketId });
    ticket.ticketStatus = ticketStatus;
    await ticket.save();
    res.status(200).send({
      success: true,
      message: "ticket status updated successfully",
      ticket: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = changeTicketStatus;
