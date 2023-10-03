const AmenityModel = require("../../../models/amenity/amenity.model");
const Error = require("../../../utils/Error");

const getAllAmenities = async (req, res, next) => {
  try {
    const allAmenities = await AmenityModel.find({})?.select("name");

    return res.json({ message: "Successful", result: allAmenities });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllAmenities;
