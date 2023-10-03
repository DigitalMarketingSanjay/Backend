const Error = require("../../../utils/Error");
const AgentModel = require("../../../models/agent/agent.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const signup = async (req, res, next) => {
  try {
    const { email, password, mobileNumber, name, type } = req.body;
    if (!email || !password || !mobileNumber || !name || !type) {
      throw new Error("Required fields missing", 400);
    }

    if (mobileNumber.length !== 10) {
      throw new Error("Please provide a valid mobile number", 400);
    }

    const exestingAgent = await AgentModel.findOne({ email: email });

    if (exestingAgent) {
      throw new Error("Agent already exist, please signIn", 401);
    }
    const hashPass = await bcrypt.hash(password, 10);

    const newAgent = new AgentModel({
      email,
      password: hashPass,
      mobileNumber: parseInt(mobileNumber),
      type,
      name,
    });

    await newAgent.save();

    const token = jwt.sign(
      {
        id: newAgent._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      message: "Successful",
      result: {
        _id: newAgent._id,
        email: newAgent.email,
        name: newAgent.name,
        mobileNumber: newAgent.mobileNumber,
        type: newAgent.type,
      },
      token: token,
    });
  } catch (error) {
    conso
    return next(error);
  }
};

module.exports = signup;
