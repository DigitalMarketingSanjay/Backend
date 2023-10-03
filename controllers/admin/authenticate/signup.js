const Error = require("../../../utils/Error");
const AdminModel = require("../../../models/admin/admin.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new Error("Required fields missing", 400);
    }

    const exestingAdmin = await AdminModel.findOne({ email: email });

    if (exestingAdmin) {
      throw new Error("Admin already exist, please signIn", 401);
    }
    const hashPass = await bcrypt.hash(password, 10);

    const newAdmin = new AdminModel({
      email,
      password: hashPass,
    });

    await newAdmin.save();

    const token = jwt.sign(
      {
        id: newAdmin._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Successful",
      result: {
        _id: newAdmin._id,
        email: newAdmin.email,
      },
      token: token,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = signup;
