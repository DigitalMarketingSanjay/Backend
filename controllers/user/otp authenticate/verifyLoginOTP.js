const otpModel = require("../../../models/otp/otpModel");
const userModel = require("../../../models/user/user.model");
const jwt = require("jsonwebtoken");

const verifyLoginOTP = async (req, res) => {
  const { mobileNumber, otp } = req.body;
  const otpHolder = await otpModel.find({
    mobileNumber: mobileNumber,
  });

  const user = await userModel.find({ mobileNumber });
  if (!user) {
    return res
      .status(400)
      .send({ success: false, message: "mobile number not registerd" });
  }
  console.log(user[0]);

  if (otpHolder[0].otp !== otp)
    return res.status(400).send("Enter Correct OTP!");

  const rightOtpFind = otpHolder[otpHolder.length - 1];
  if (rightOtpFind.mobileNumber === mobileNumber) {
    const token = jwt.sign(
      {
        id: user[0]._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    const OTPDelete = await otpModel.deleteMany({
      mobileNumber: rightOtpFind.mobileNumber,
    });
    return res.status(200).send({
      message: "User Logged in Successfull!",
      token: token,
      data: user,
    });
  } else {
    return res.status(400).send("Your OTP was wrong!");
  }
};

module.exports = verifyLoginOTP;
