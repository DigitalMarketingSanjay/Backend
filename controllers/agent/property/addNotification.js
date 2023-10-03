const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");

const addNotification = async (req, res) => {
  try {
    const { agentId, propertyId } = req.body;
    const userId = req.bearerId;
    if (!agentId || !propertyId || !userId) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const user = await userModel.findById({ _id: userId });
    const property = await propertyModel.findById({ _id: propertyId });
    const agent = await userModel.findById({ _id: agentId });

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    if (!property) {
      return res
        .status(400)
        .send({ success: false, message: "property not found" });
    }
    if (!agent) {
      return res
        .status(400)
        .send({ success: false, message: "agent not found" });
    }
    const notification = {
      tittle: `${property.name}`,
      description: `${user.name} visited your property`,
    };
    agent.notifications.push(notification);
    await agent.save();
    res.status(200).send({
      success: true,
      message: "notification sent successfully",
      notification: notification,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = addNotification;
