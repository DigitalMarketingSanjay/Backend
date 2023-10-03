const AgentModel = require("../../../models/agent/agent.model");
const Error = require("../../../utils/Error");

const getCurrentAgent = async (req, res, next) => {
  try {
    const { agentId } = req.bearerId;
    // const agentId = "63d8d60bc5a35beaaffe11e9";
    if (!agentId) throw new Error("Please provide a agentId id", 400);

    const requiredAgent = await AgentModel.findById(agentId);

    if (!requiredAgent) {
      throw new Error("The agent does not exist", 404);
    }
    // await requiredUser.populate("agentId", "-password");

    return res.json({ message: "Successful", result: requiredAgent });
  } catch (error) {
    return next(error);
  }
};

module.exports = getCurrentAgent;
