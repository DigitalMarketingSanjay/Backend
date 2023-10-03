const PropertyModel = require("../../models/property/property.model");
const Error = require("../../utils/Error");

const getPropertiesByFeature = async (req, res, next) => {
  try {
    const { limit = null, page = 1 } = req.query;
    const filter = { featured: true };
    if (limit) {
      const requiredProperties = await PropertyModel.find(filter)
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      return res.json({ message: "Successful", result: requiredProperties });
    }
    const requiredProperties = await PropertyModel.find(filter)
      .sort({ _id: -1 })
      .exec();
    return res.json({ message: "Successful", result: requiredProperties });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesByFeature;
