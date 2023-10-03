const ticketModel = require("../../models/ticket/ticket.model");
const userModel = require("../../models/user/user.model");

const addTicket = async (req, res) => {
  try {
    const { tittle, message } = req.body;
    const userId = req.bearerId;
    // const userId = "649ac09732b08547ed03b09a";

    const user = await userModel.findById({ _id: userId });
    const ticket = await new ticketModel({
      userId,
      userName: user.name,
      userEmail: user.email,
      tittle,
      message,
    });
    await ticket.save();
    res.status(200).send({
      success: true,
      message: "ticket added successfully",
      ticket: ticket,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = addTicket;
