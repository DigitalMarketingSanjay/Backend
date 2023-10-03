const newsletterModel = require("../../models/newsletter/newsletterModel");

const getNewsLetterEmails = async (req, res) => {
  try {
    const emails = await newsletterModel.find({}).sort({ _id: -1 });
    res.status(200).send({
      success: true,
      message: "emails fetched successfully",
      data: emails,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};
module.exports = getNewsLetterEmails;
