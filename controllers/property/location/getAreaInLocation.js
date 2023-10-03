const LocationModel = require("../../../models/location/location.model");
const Error = require("../../../utils/Error");

const getAreaInLocation = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new Error("Please provide a location id", 400);
    }

    const requiredLocation = await LocationModel.findById(id);

    if (!requiredLocation) {
      throw new Error("The location does not exist", 404);
    }

    await requiredLocation.populate("areas", "name");

    return res.json({ message: "Successful", result: requiredLocation?.areas });
  } catch (error) {
    next(error);
  }
};

module.exports = getAreaInLocation;
