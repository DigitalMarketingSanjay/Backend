const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");

const changeCareServiceStatus = async (req, res) => {
  try {
    const { propertyId, status } = req.body;
    if (!propertyId) {
      return res
        .status(400)
        .send({ success: false, message: "all fields are required" });
    }
    const property = await propertyModel.findById({ _id: propertyId });
    if (!property) {
      return res
        .status(400)
        .send({ success: false, message: "proeprty not found" });
    }
    property.careService = status;
    await property.save();
    if (property.careService === true) {
      property.status = "inactive";
    } else {
      property.status = "active";
    }
    await property.save();
    res
      .status(200)
      .send({ success: true, message: "care service updated", data: property });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};
module.exports = changeCareServiceStatus;
