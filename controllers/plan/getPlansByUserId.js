const adminModel = require("../../models/admin/admin.model");

const getPlansByUserId = async (req, res) => {
  try {
    const id = req.bearerId;
    const adminId = "64bbba044cd4c09fc77762e9";
    const admin = await adminModel.findById({ _id: adminId });
    if (!admin) {
      return res
        .status(400)
        .send({ success: false, message: "admin not found" });
    }
    const plans = admin.plans.filter(
      (element) => element.userId.toString() === id
    );
    return res.status(200).send({
      success: true,
      message: "my plans fetched successfully",
      myPlan: plans[plans.length - 1],
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = getPlansByUserId;
