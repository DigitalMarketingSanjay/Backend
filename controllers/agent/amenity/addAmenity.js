const AmenityModel = require("../../../models/amenity/amenity.model");
// const Error = require("../../../utils/Error");

const addAmenity = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("Please provide Amenity", 400);
    }

    const exestingAmenity = await AmenityModel.findOne({ name: name });

    if (exestingAmenity) {
      throw new Error("The Amenity already exist", 400);
    }

    const newAmenity = new AmenityModel({
      name: name,
    });
    await newAmenity.save();

    return res.json({ message: "Successful", result: newAmenity });
  } catch (error) {
    next(error);
  }
};

module.exports = addAmenity;
