const Error = require("../../../utils/Error");
const AgentModel = require("../../../models/agent/agent.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new Error("Required fields missing", 400);
    }

    const requiredAgent = await AgentModel.findOne({ email: email });

    if (!requiredAgent) {
      throw new Error("No agent with this email exist, please signup", 404);
    }

    if (await bcrypt.compare(password, requiredAgent.password)) {
      const token = jwt.sign(
        {
          id: requiredAgent._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "7d",
        }
      );
      return res.json({
        message: "Successful",
        result: {
          _id: requiredAgent._id,
          email: requiredAgent.email,
          name: requiredAgent.name,
          mobileNumber: requiredAgent.mobileNumber,
          profilePhoto: requiredAgent?.profilePhoto,
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
