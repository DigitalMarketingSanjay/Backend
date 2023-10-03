const planModel = require("../../../models/plan/plan.model");
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

const increaseLeadCount = async (req, res) => {
  try {
    const { userId, planId, count } = req.body;
    const user = await userModel.findById({ _id: userId });
    const plan = await planModel.findById({ _id: planId });
    user.leadCount = parseInt(user?.leadCount) + parseInt(count);
    user.premium = true;
    const obj = {
      planId: plan._id,
      name: plan.name,
      price: plan.price,
    };
    user.plan = obj;
    await user.save();
    // Send email confirmation
    // const link = `https://my-propert-go-zeta.vercel.app`;
    const mailOptions = {
      from: "deepakaklecha2020@gmail.com",
      to: user.email,
      subject: "Plan upgraded by Admin",
      html: `<p>Hello ${user.name}, <br> Plan upgraded by Admin,payment received and your plan has been upgraded successfully</p>`,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send({
      success: true,
      message: "lead count added successfully, subscription added to the user",
      user: user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = increaseLeadCount;
