const AgentModel = require("../../../models/agent/agent.model");
const Error = require("../../../utils/Error");

const getAgentProperties = async (req, res, next) => {
  try {
    const { agentId } = req.body;
    const { limit = null, page = 1 } = req.query;
    if (!agentId) {
      throw new Error("Please provide an agentId", 400);
    }
    const requiredAgent = await AgentModel.findById(agentId);
    if (!requiredAgent) {
      throw new Error("The agent does not exist", 404);
    }
    if (limit) {
      await requiredAgent.populate({
        path: "properties",
        options: {
          limit: limit * 1,
          skip: (page - 1) * limit,
        },
      });

      return res.json({ message: "Successful", result: requiredAgent });
    }

    await requiredAgent.populate("properties");
    return res.json({ message: "Successful", result: requiredAgent });
  } catch (error) {
    next(error);
  }
};

module.exports = getAgentProperties;
