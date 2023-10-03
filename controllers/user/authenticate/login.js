const Error = require("../../../utils/Error");
const UserModel = require("../../../models/user/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Required fields missing", 400);
    }
    const requiredUser = await UserModel.findOne({ email: email });
    if (!requiredUser) {
      throw new Error("No user with this email exist, please signup", 404);
    }
    if (await bcrypt.compare(password, requiredUser.password)) {
      const token = jwt.sign(
        {
          id: requiredUser._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.json({
        message: "Successful",
        result: {
          _id: requiredUser._id,
          email: requiredUser.email,
          name: requiredUser.name,
          mobileNumber: requiredUser.mobileNumber,
          profilePhoto: requiredUser?.profilePhoto,
        },
        token: token,
      });
    } else {
      throw new Error("Invalid credentials", 401);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = login;
