const otpModel = require("../../../models/otp/otpModel");
const userModel = require("../../../models/user/user.model");
const jwt = require("jsonwebtoken");
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

const verifySignupOTP = async (req, res) => {
  const { name, email, mobileNumber, otp } = req.body;
  const otpHolder = await otpModel.find({
    mobileNumber: mobileNumber,
  });

  if (otpHolder[0]?.otp !== otp)
    return res.status(400).send("Enter Correct OTP!");

  const rightOtpFind = otpHolder[otpHolder.length - 1];
  if (rightOtpFind.mobileNumber === mobileNumber) {
    const user = new userModel({ name, email, mobileNumber });
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const result = await user.save();
    const OTPDelete = await otpModel.deleteMany({
      mobileNumber: rightOtpFind.mobileNumber,
    });
    // Send email confirmation
    // const link = `https://my-propert-go-zeta.vercel.app`;
    const mailOptions = {
      from: "deepakaklecha2020@gmail.com",
      to: user.email,
      subject: "Account created",
      html: `<p>Dear ${user.name}, <br> Your account has been created successfully on myproperty go</p>`,
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).send({
      message: "User Registration Successfull!",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send("Your OTP was wrong!");
  }
};

module.exports = verifySignupOTP;
