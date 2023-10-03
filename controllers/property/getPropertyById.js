const PropertyModel = require("../../models/property/property.model");
const Error = require("../../utils/Error");

const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("Please provide a property id", 400);

    const requiredProperty = await PropertyModel.findById(id);

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }
    await requiredProperty.populate("agentId", "-password");

    return res.json({ message: "Successful", result: requiredProperty });
  } catch (error) {
    return next(error);
  }
};

module.exports = getPropertyById;
