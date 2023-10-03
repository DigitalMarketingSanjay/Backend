const adminModel = require("../../models/admin/admin.model");

const getAllOrders = async (req, res) => {
  try {
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    const admin = await adminModel.findById({ _id: adminId });
    const condition = {};
    if (req.query) {
      if (req.query.paid === "true" || req.query.paid === true) {
        condition.paid = true;
      } else if (req.query.paid === "false" || req.query.paid === false) {
        condition.paid = false;
      }
    }

    const data = admin.plans.filter((e) => {
      return e.paid === condition.paid;
    });
    // console.log(data);
    if (data.length > 0) {
      return res.status(200).send({
        success: true,
        message: "orders fetched successfully",
        orders: data,
      });
    }
    res.status(200).send({
      success: true,
      message: "orders fetched successfully",
      orders: admin.plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = getAllOrders;
