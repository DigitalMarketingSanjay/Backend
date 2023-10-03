const AgentModel = require("../../../models/agent/agent.model");

const getAllAgents = async (req, res, next) => {
  try {
    const { page = 1, limit = null } = req.query;

    if (limit) {
      const allAgents = await AgentModel.find({})
        .select("-password")
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      return res.json({ message: "Successful", result: allAgents });
    }

    const allAgents = await AgentModel.find({});
    return res.json({ message: "Successful", result: allAgents });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllAgents;
