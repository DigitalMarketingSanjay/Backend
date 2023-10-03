const adminModel = require("../../../models/admin/admin.model");

const getAllCareServiceRequests = async (req, res) => {
  try {
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    adminModel
      .findById(adminId)
      .populate("careServiceRequest.userId") // Populate the 'userId' field with User details
      .populate("careServiceRequest.propertyId") // Populate the 'propertyId' field with Property details
      .exec((err, admin) => {
        if (err) {
          console.log(err);
        } else {
          // The 'admin' object now contains the populated 'careServiceRequest' array with user and property details
          console.log(admin.careServiceRequest);
          return res.status(200).send({
            success: true,
            message: " data fetched successfully",
            data: admin.careServiceRequest,
          });
        }
      });
    // const adminId = req.bearerId;
    // // const adminId = "64bbba044cd4c09fc77762e9";
    // const admin = await adminModel.findById({ _id: adminId });
    // if (!admin) {
    //   return res
    //     .status(400)
    //     .send({ success: false, message: "admin is not present" });
    // }
    // res.status(200).send({
    //   success: true,
    //   message: "requests fetched successfully",
    //   data: admin.careServiceRequest,
    // });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};
module.exports = getAllCareServiceRequests;
