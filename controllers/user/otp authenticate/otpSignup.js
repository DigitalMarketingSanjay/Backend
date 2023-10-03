const userModel = require("../../../models/user/user.model");
const otpGenerator = require("otp-generator");
const otpModel = require("../../../models/otp/otpModel");
const axios = require("axios");

const otpSignup = async (req, res) => {
  const { mobileNumber } = req.body;
  if (!mobileNumber) {
    return res.status(400).json({ message: "Enter Mobile no" });
  }
  const user = await userModel.findOne({
    mobileNumber: mobileNumber,
  });

  if (user) return res.status(400).send("User already registered!");
  const min = 1000;
  const max = 9999;
  const OTP = Math.floor(Math.random() * (max - min + 1)) + min;

  console.log(OTP);
  const message = `Hi User, Your OTP for Wonderplots.com login verification code is ${OTP}. The OTP is valid for 5mins. Thank you`;
  const apiResponse = await axios.get(
    `https://www.txtguru.in/imobile/api.php?username=chaitu.nag1991&password=92510356&source=WONDVE&dmobile=${mobileNumber}&dlttempid=1007653957743349352&message=${message}`
  );
  const otp = await otpModel({
    mobileNumber: mobileNumber,
    otp: OTP,
  });

  await otp.save();
  res.status(200).send({ message: "Otp send successfully!", otp: otp });
};

module.exports = otpSignup;
