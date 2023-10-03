const contactModel = require("../../models/contact/contactModel");

const getAllContactDetails = async (req, res) => {
  try {
    const details = await contactModel.find({}).sort({ _id: -1 });
    res.status(200).send({
      success: true,
      message: "all contact details fetched successfully",
      data: details,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = getAllContactDetails;
