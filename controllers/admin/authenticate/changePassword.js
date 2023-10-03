const adminModel = require("../../../models/admin/admin.model");
const bcrypt = require("bcrypt");

const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    const admin = await adminModel.findById({ _id: adminId });
    if (!admin) {
      return res.status(400).send({
        success: false,
        message: "Admin with this email id is not present",
      });
    }
    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    console.log(isMatch);
    if (!isMatch) {
      return res.status(400).send({
        success: false,
        message: "Entered old password is not matching",
      });
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();
    res.status(200).send({
      success: true,
      message: "admin password changed successfully",
      admin: admin,
    });
  } catch (error) {
    console.log(error);
    res.status({ success: false, message: error.message });
  }
};

module.exports = changePassword;
