const userModel = require("../../../models/user/user.model");

const getNotificationsByAgentId = async (req, res) => {
  try {
    const { id } = req.params;
    const agent = await userModel.findById({ _id: id });
    res.status(200).send({
      success: true,
      message: "notifications fetched successfully",
      notifications: agent.notifications,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = getNotificationsByAgentId;
