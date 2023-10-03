const ticketModel = require("../../models/ticket/ticket.model");

const getTicketByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const ticket = await ticketModel.find({ userId: userId }).sort({ _id: -1 });
    res.status(200).send({
      success: true,
      message: "ticket fetched successfully",
      ticket: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = getTicketByUserId;
