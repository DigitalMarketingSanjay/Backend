const PropertyModel = require("../../models/property/property.model");
const Error = require("../../utils/Error");

const getPropertiesByLocation = async (req, res, next) => {
  try {
    const { locationId } = req.params;
    const { limit = null, page = 1 } = req.query;

    if (!locationId) {
      throw new Error("Please provide a location id", 400);
    }

    if (limit) {
      const requiredProperties = await PropertyModel.find({
        "location.locationId": locationId,
      })
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      return res.json({ message: "Successful", result: requiredProperties });
    }

    const requiredProperties = await PropertyModel.find({
      "location.locationId": locationId,
    })
      .sort({ _id: -1 })
      .exec();

    return res.json({ message: "Successful", result: requiredProperties });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesByLocation;
