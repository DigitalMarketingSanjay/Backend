const PropertyModel = require("../../../../models/property/property.model");
const AgentModel = require("../../../../models/agent/agent.model");
const Error = require("../../../../utils/Error");

const getPropertiesWithBuyers = async (req, res, next) => {
  try {
    const agentId = req.bearerId;
    if (!agentId) throw new Error("Please provide a agent id", 400);

    const requiredAgent = await AgentModel.findById(agentId);
    if (!requiredAgent) throw new Error("Agent does not exist", 404);

    await requiredAgent.populate({
      path: "properties",
      match: {
        purchaseRequests: { $not: { $size: 0 } },
      },
    });

    const propertyList = requiredAgent?.properties;

    return res.json({
      message: "Successful",
      result: propertyList,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesWithBuyers;
