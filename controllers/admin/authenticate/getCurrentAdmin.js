const AdminModel = require("../../../models/admin/admin.model");
const Error = require("../../../utils/Error");

const getCurrentAdmin = async (req, res, next) => {
  try {
    const { adminId } = req.bearerId;
    if (!adminId) throw new Error("Please provide a adminId", 400);

    const requiredAdmin = await AdminModel.findById(adminId);

    if (!requiredAdmin) {
      throw new Error("The admin does not exist", 404);
    }
    // await requiredUser.populate("agentId", "-password");

    return res.json({ message: "Successful", result: requiredAdmin });
  } catch (error) {
    return next(error);
  }
};

module.exports = getCurrentAdmin;
