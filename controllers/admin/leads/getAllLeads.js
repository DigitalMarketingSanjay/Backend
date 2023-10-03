const adminModel = require("../../../models/admin/admin.model");

const getAllLeads = async (req, res) => {
  try {
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    const admin = await adminModel
      .findById(adminId)
      .populate("leads.propertyId") // Populate the propertyId field in leads array
      .sort({ _id: -1 });

    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Admin with this Id is not present in the database",
      });
    }

    res.status(200).send({
      success: true,
      message: "All leads fetched successfully",
      result: admin.leads,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "An error occurred while fetching leads",
    });
  }
};

module.exports = getAllLeads;
