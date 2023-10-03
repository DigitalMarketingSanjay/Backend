const propertyModel = require("../../../models/property/property.model");
const nodemailer = require("nodemailer");
const userModel = require("../../../models/user/user.model");
require("dotenv").config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const changePropertyStatus = async (req, res) => {
  try {
    const { propertyId, status } = req.body;
    if (!propertyId || !status) {
      return res
        .status(400)
        .send({ success: false, message: "all fields are required" });
    }
    const property = await propertyModel.findById({ _id: propertyId });
    if (!property) {
      return res
        .status(400)
        .send({ success: false, message: "property is not present" });
    }
    property.status = status;
    await property.save();
    if (property.agentId) {
      const user = await userModel.findById({ _id: property.agentId });
      if (user) {
        // Send email confirmation
        // const link = `https://my-propert-go-zeta.vercel.app`;
        const mailOptions = {
          from: "deepakaklecha2020@gmail.com",
          to: user.email,
          subject: "Property accepted for listing",
          html: `<p>Hello ${user.name}, <br>Your Property accepted for listing and your property Id is ${propertyId} and status is ${status}</p>`,
        };
        await transporter.sendMail(mailOptions);
      }
    }

    return res.status(200).send({
      success: true,
      message: "status updated successfully",
      data: property,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = changePropertyStatus;
