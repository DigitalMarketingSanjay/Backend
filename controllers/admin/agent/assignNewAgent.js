const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");
require("dotenv").config();
const nodemailer = require("nodemailer");

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const assignNewAgent = async (req, res) => {
  try {
    const { propertyId, newAgentId } = req.body;
    const property = await propertyModel.findById({ _id: propertyId });
    if (!property) {
      return res
        .status(400)
        .send({ success: false, message: "property not found" });
    }
    property.newAgentId = newAgentId;
    await property.save();

    const requiredAgent = await userModel.findById(newAgentId);
    if (!requiredAgent) {
      throw new Error("The agent does not exist", 404);
    }
    requiredAgent?.properties?.push(property);
    await requiredAgent.save();

    if (property.agentId) {
      const user = await userModel.findById({ _id: property.agentId });
      if (user) {
        // Send email confirmation
        const link = `https://my-propert-go-zeta.vercel.app`;
        const mailOptions = {
          from: "deepakaklecha2020@gmail.com",
          to: user.email,
          subject: "A New Agent is assigned for the Owner",
          html: `<p>Hello ${user.name}, <br>New Agent ${requiredAgent?.name} is assigned for your property and your property Id is ${propertyId},<br> visit our website ${link}</p>`,
        };
        await transporter.sendMail(mailOptions);
      }
    }
    res.status(200).send({
      success: true,
      message: "new agent added successfully",
      property: property,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = assignNewAgent;
