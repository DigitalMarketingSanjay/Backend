const LocationModel = require("../../../models/location/location.model");
const Error = require("../../../utils/Error");

const getAllLocation = async (req, res, next) => {
  try {
    const allLocations = await LocationModel.find({}).sort({ _id: -1 });

    return res.json({ message: "Successful", result: allLocations });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllLocation;
