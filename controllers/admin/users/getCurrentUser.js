const UserModel = require("../../../models/user/user.model");
const Error = require("../../../utils/Error");

const getCurrentUser = async (req, res, next) => {
  try {
    const { userId } = req.bearerId;
    // const userId = "62e39aa4c84f5d6baf338177";
    if (!userId) throw new Error("Please provide a userId id", 400);

    const requiredUser = await UserModel.findById(userId);

    if (!requiredUser) {
      throw new Error("The user does not exist", 404);
    }
    // await requiredUser.populate("agentId", "-password");

    return res.json({ message: "Successful", result: requiredUser });
  } catch (error) {
    return next(error);
  }
};

module.exports = getCurrentUser;
