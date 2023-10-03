const AreaModel = require("../../models/area/area.model");
const Error = require("../../utils/Error");

const getPropertiesByArea = async (req, res, next) => {
  try {
    const { areaId } = req.body;
    const {
      priceMax,
      priceMin,
      availableFor,
      BHKconfig,
      amenities = [],
    } = req.body;

    const { limit = null, page = 1 } = req.query;

    if (!areaId) throw new Error("Please provide an areaId", 400);

    const requiredArea = await AreaModel.findById(areaId);

    if (!requiredArea) throw new Error("The area does not exist", 404);

    //filters object
    let filters = {};

    //filter by availableFor
    if (availableFor) {
      filters = { ...filters, availableFor: availableFor };
    }

    //filter by price
    if (priceMax && priceMin) {
      filters = { ...filters, cost: { $lte: priceMax, $gte: priceMin } };
    }

    //filter by BHKconfig
    if (BHKconfig) {
      filters = { ...filters, BHKconfig: BHKconfig };
    }

    //filter by amenities
    if (amenities && amenities.length > 0) {
      filters = { ...filters, amenities: { $all: amenities } };
    }

    await requiredArea.populate({
      path: "properties",
      options: { sort: { _id: -1 } },
      match: { ...filters },
      limit: limit * 1,
      skip: (page - 1) * limit * 1,
    });

    return res.json({ message: "Successful", result: requiredArea });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesByArea;
