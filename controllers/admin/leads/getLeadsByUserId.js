const userModel = require("../../../models/user/user.model");

const getLeadsByUserId = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userModel.findById({ _id: id });
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "user with these Id is not present in db",
      });
    }

    res.status(200).send({
      success: true,
      message: "all leads fetched successfully",
      result: user.leads,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getLeadsByUserId;
