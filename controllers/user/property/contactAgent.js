const PropertyModel = require("../../../models/property/property.model");
const PurchaseRequestModel = require("../../../models/purchaseRequest/purchaseRequest.model");
const userModel = require("../../../models/user/user.model");
const Error = require("../../../utils/Error");
const nodemailer = require("nodemailer");
require("dotenv").config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const contactAgent = async (req, res, next) => {
  try {
    const { propertyId, message = "" } = req.body;
    if (!propertyId) {
      throw new Error("Please provide a property id", 400);
    }

    const userId = req.bearerId;
    // const userId = "63d7807f1856ff7b2f639446";
    if (!userId) {
      throw new Error("Please provide a user id ", 400);
    }
    const requiredProperty = await PropertyModel.findById(propertyId);
    const requiredUser = await userModel.findById({ _id: userId });
    const requiredAgent = await userModel.findById({
      _id: requiredProperty?.agentId.toString(),
    });
    // console.log(requiredAgent);
    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }
    const newPurchaseRequest = new PurchaseRequestModel({
      user: userId,
      property: propertyId,
      agent: requiredProperty?.agentId.toString(),
      message: message,
    });
    await newPurchaseRequest.save();

    requiredProperty.purchaseRequests.push(newPurchaseRequest);
    await requiredProperty.save();

    if (requiredAgent) {
      const mailOptions = {
        from: "deepakaklecha2020@gmail.com",
        to: requiredAgent.email,
        subject: "Property message from user",
        html: `<p>${requiredUser.name} visited your property!</p>
      <p>Message by user- ${message}</p> <br> 
      user contact details- <br>
      email- ${requiredUser.email}, 
      mobile- ${requiredUser.mobileNumber} `,
      };
      await transporter.sendMail(mailOptions);
    }

    return res.json({ message: "Successful", result: newPurchaseRequest });
  } catch (error) {
    next(error);
  }
};

module.exports = contactAgent;
