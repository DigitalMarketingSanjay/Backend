const PropertyModel = require("../../models/property/property.model");

const Error = require("../../utils/Error");

const getPropertyByFilter = async (req, res, next) => {
  try {
    const {
      priceMax,
      priceMin,
      BHKconfig,
      propertyType,
      availableFor,
      featured,
      furnishingStatus,
      numOfBathroom,
      numOfParking,
      location,
      area = [],
      amenities = [],
      limit = null,
      page = 1,
    } = req.query;

    const query = PropertyModel.find({}).sort({ _id: -1 });
    // console.log(query);
    //filter by price
    if (priceMax && priceMin) {
      query.where("cost").gt(priceMin).lt(priceMax);
    }

    //filter by Location
    if (location) {
      query.where("location").equals(location);
    }

    //filter by BHk configuration
    if (BHKconfig) {
      query.where("BHKconfig").equals(BHKconfig);
    }
    //filter for amenities
    if (amenities && amenities.length > 0) {
      query.where("amenities").all(amenities);
    }

    if (limit) {
      const allProperties = await query
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();

      return res.json({ message: "Successful", result: allProperties });
    }
    console.log(query);
    const allProperties = await query.exec();
    console.log("all property", allProperties);
    if (!allProperties || allProperties.length === 0) {
      throw new Error("Failed to find the required properties", 404);
    }

    return res.json({ message: "Successful", result: allProperties });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertyByFilter;
