const PropertyModel = require("../../../../models/property/property.model");
const AgentModel = require("../../../../models/agent/agent.model");
const Error = require("../../../../utils/Error");

const getBuyersByProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;
    const agentId = req.bearerId;

    if (!propertyId || !agentId) {
      throw new Error("Required fields missing", 400);
    }

    const requiredProperty = await PropertyModel.findById(propertyId);
    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }

    if (requiredProperty.agentId.toString() !== agentId) {
      throw new Error("You are not authorized for this operation", 403);
    }

    await requiredProperty.populate({
      path: "purchaseRequests",
      populate: { path: "user", select: "-password" },
    });
    return res.json({
      message: "Successful",
      result: requiredProperty,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = getBuyersByProperty;
