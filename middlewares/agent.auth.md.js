const Error = require("../utils/Error");
const jwt = require("jsonwebtoken");
const AgentModel = require("../models/agent/agent.model");

const authCheck = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error("Failed to authorize", 401);
    const decoded = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (!decoded) throw new Error("Invalid authorization token", 401);

    const id = decoded.id;
    const agent = await AgentModel.findById(id).select("_id");
    if (agent) {
      req.bearerId = id;
      req.role = "AGENT";

      return next();
    } else {
      throw new Error("Invalid agent", 401);
    }
  } catch (error) {
    return next(error);
  }
};

module.exports = authCheck;
