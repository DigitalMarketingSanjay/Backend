const AreaModel = require("../../../../models/area/area.model");
const LocationModel = require("../../../../models/location/location.model");

const Error = require("../../../../utils/Error");

const addNewArea = async (req, res, next) => {
  try {
    const { locationId, name } = req.body;
    if (!locationId) {
      throw new Error("Please provide a location id", 400);
    }
    if (!name) {
      throw new Error("Please provide a name", 400);
    }

    const requiredLocation = await LocationModel.findById(locationId)?.populate(
      {
        path: "areas",
        select: "name",
      }
    );

    if (!requiredLocation) {
      throw new Error("The location does not exist", 404);
    }

    //check if location already contains area or not
    for (const area of requiredLocation.areas) {
      if (area.name === name) {
        throw new Error("The area already exists in this location", 400);
      }
    }

    const newArea = new AreaModel({
      name: name,
      properties: [],
    });

    requiredLocation.areas.push(newArea);
    await requiredLocation.save();
    await newArea.save();

    return res.json({ message: "Successful", result: newArea });
  } catch (error) {
    next(error);
  }
};

module.exports = addNewArea;
