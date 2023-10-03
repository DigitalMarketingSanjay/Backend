const PropertyModel = require("../../models/property/property.model");
const Error = require("../../utils/Error");

const getPropertiesByType = async (req, res, next) => {
  try {
    const { propertyType } = req.body;
    const { limit = null, page = 1 } = req.query;

    if (!propertyType) {
      throw new Error("Please provide a property type", 400);
    }

    if (limit) {
      const requiredProperties = await PropertyModel.find({
        "propertyType": propertyType,
      })
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      return res.json({ message: "Successful", result: requiredProperties });
    }

    const requiredProperties = await PropertyModel.find({
      "propertyType": propertyType,
    })
      .sort({ _id: -1 })
      .exec();

    return res.json({ message: "Successful", result: requiredProperties });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesByType;
