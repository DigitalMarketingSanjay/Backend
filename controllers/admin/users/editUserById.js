const userModel = require("../../../models/user/user.model");

const editUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, mobileNumber, leadCount } = req.body;
    if (!id) {
      return res.status(400).send({ success: false, message: "pass user id" });
    }
    const user = await userModel.findById({ _id: id });

    if (!user) {
      return res.status(404).send("User not found.");
    }

    // Update the user's name and email if provided
    if (name) {
      user.name = name;
    }

    if (email) {
      user.email = email;
    }
    if (mobileNumber) {
      user.mobileNumber = mobileNumber;
    }
    if (leadCount) {
      user.leadCount = leadCount;
    }

    await user.save();
    res.status(200).json({
      status: 200,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = editUserById;
