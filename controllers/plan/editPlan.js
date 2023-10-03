const adminModel = require("../../models/admin/admin.model");

const editPlan = async (req, res) => {
  try {
    const { id, paid, userEmail, planName, price } = req.body;
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    const admin = await adminModel.findById({ _id: adminId });
    admin.plans.map((element) => {
      if (element._id.toString() === id) {
        if (paid) {
          element.paid = paid;
        }
        if (userEmail) {
          element.userEmail = userEmail;
        }
        if (planName) {
          element.planName = planName;
        }
        if (price) {
          element.price = price;
        }
      }
    });
    await admin.save();
    res.status(200).send({
      success: true,
      message: "Plan Element updated successfully",
      plans: admin.plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = editPlan;
