const adminModel = require("../../../models/admin/admin.model");
const propertyModel = require("../../../models/property/property.model");
const ticketModel = require("../../../models/ticket/ticket.model");
const userModel = require("../../../models/user/user.model");

const getCountOfAll = async (req, res) => {
  try {
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    const userCount = await userModel.countDocuments();
    const propertyCount = await propertyModel.countDocuments();
    const ticketCount = await ticketModel.countDocuments();
    const admin = await adminModel.findById({ _id: adminId });
    res.status(200).send({
      success: false,
      message: "All counts fetched successfully",
      userCount: userCount,
      propertyCount: propertyCount,
      ticketCount: ticketCount,
      ordersCount: admin?.plans.length,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getCountOfAll;
