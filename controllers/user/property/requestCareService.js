const adminModel = require("../../../models/admin/admin.model");
const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");

const requestCareService = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.bearerId;
    // const userId = "63d7807f1856ff7b2f639446";
    if (!userId || !propertyId) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const admin = await adminModel.findById({
      _id: "64bbba044cd4c09fc77762e9",
    });
    if (!admin) {
      return res
        .status(400)
        .send({ success: false, message: " admin is not present" });
    }
    const obj = {
      userId,
      propertyId,
    };
    admin.careServiceRequest.push(obj);
    await admin.save();
    res
      .status(200)
      .send({ success: true, message: "request sent successfully", data: obj });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};

module.exports = requestCareService;
