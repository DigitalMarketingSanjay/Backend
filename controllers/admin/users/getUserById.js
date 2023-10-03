const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).send({ success: false, message: "pass user id" });
    }
    const user = await userModel.findById({ _id: id });
    const property = await propertyModel.find({ agentId: id });

    res.status(200).json({
      status: 200,
      data: user,
      property: property,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = getUserById;
