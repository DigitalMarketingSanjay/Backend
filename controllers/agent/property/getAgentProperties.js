const AgentModel = require("../../../models/agent/agent.model");
const propertyModel = require("../../../models/property/property.model");
const userModel = require("../../../models/user/user.model");

const getAgentProperties = async (req, res, next) => {
  try {
    // const { type } = req.query;
    const agentId = req.bearerId;
    // const agentId = "63d7807f1856ff7b2f639446";
    const requiredAgent = await userModel.findById(agentId).select("-password");
    if (!requiredAgent) {
      throw new Error("The user does not exist", 404);
    }

    // if (type) {
    //   await requiredAgent.populate({
    //     path: "properties",
    //     match: { availableFor: `${type}` },
    //   });
    //   return res.json({ message: "Successful", result: requiredAgent });
    // }

    const properties = await propertyModel.find({ agentId: requiredAgent._id });

    // await requiredAgent.populate("properties");

    return res.json({ message: "Successful", result: properties });
  } catch (error) {
    next(error);
  }
};

module.exports = getAgentProperties;
