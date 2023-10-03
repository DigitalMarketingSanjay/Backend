const userModel = require("../../../models/user/user.model");

const getUserDetails = async (req, res) => {
  try {
    const id = req.bearerId;
    // const id = "63d7807f1856ff7b2f639446";
    if (!id) {
      return res.status(400).send({ success: false, message: "pass user id" });
    }
    const user = await userModel.findById({ _id: id });
    res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = getUserDetails;
