const adminModel = require("../../../models/admin/admin.model");
const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");
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

const addLead = async (req, res) => {
  try {
    const { adminId, agentId, propertyId } = req.body;
    const userId = req.bearerId;
    // const userId = "63fe0f3c1899b2105e9cf8f9";
    const user = await userModel.findById({ _id: userId });
    const property = await propertyModel.findById({ _id: propertyId });
    const admin = await adminModel.findById({ _id: adminId });
    if (!admin) {
      return res
        .status(400)
        .send({ success: false, message: "Admin not found" });
    }

    if (!user) {
      return res
        .status(400)
        .send({ success: false, message: "User not found" });
    }
    if (!property) {
      return res
        .status(400)
        .send({ success: false, message: "property not found" });
    }
    const agent = await userModel.findById({ _id: agentId });
    const lead = {
      userId,
      agentId,
      propertyId,
      agentName: agent.name,
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobileNumber,
      propertyName: property.name,
    };

    agent.leads.push(lead);
    await agent.save();
    admin.leads.push(lead);
    await admin.save();
    // Send email confirmation
    const mailOptions = {
      from: "deepakaklecha2020@gmail.com",
      to: agent.email,
      subject: "New lead Generated",
      html: `<p>Hello ${agent.name}, <br>New lead Generated for Your Property ${property.name},<br> visit our website</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send({
      success: true,
      message: "lead added",
      adminLeads: admin.leads,
      agentLeads: agent.leads,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = addLead;
