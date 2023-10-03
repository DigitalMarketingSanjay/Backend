const contactModel = require("../../models/contact/contactModel");

const contactDetails = async (req, res) => {
  try {
    const { name, email, mobileNumber, service, message } = req.body;
    if (!name || !email || !message || !service) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const contact = await new contactModel(req.body);
    await contact.save();
    res.status(200).send({
      success: false,
      message: "message sent successfully",
      data: contact,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = contactDetails;
