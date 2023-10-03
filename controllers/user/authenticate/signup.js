const Error = require("../../../utils/Error");
const UserModel = require("../../../models/user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { email, password, mobileNumber, name } = req.body;
    if (!email || !password || !mobileNumber || !name) {
      throw new Error("Required fields missing", 400);
    }

    if (mobileNumber.length !== 10) {
      throw new Error("Please provide a valid mobile number", 400);
    }
    const exestingUser = await UserModel.findOne({ email: email });
    if (exestingUser) {
      throw new Error("User already exist, please signIn", 401);
    }
    const hashPass = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      email,
      password: hashPass,
      mobileNumber: parseInt(mobileNumber),
      name,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Successful",
      result: {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        mobileNumber: newUser.mobileNumber,
      },
      token: token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = signup;
