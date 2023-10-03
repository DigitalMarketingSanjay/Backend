const PropertyModel = require("../../../models/property/property.model");
// const Error = require("../../utils/Error");

const createFeatured = async (req, res, next) => {
  try {
    const {propertyId,isFeatured}=req.body;
    if (!propertyId) throw new Error("Please provide a property id", 400);

    const requiredProperty = await PropertyModel.findOneAndUpdate(
      { _id: propertyId },
      { $set: { featured: isFeatured } },
      (err, property) => {
        if (err) {
          console.error(err);
        }
      }
    ).clone().catch(function(err){ console.log(err)});

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }
    await requiredProperty.populate("agentId", "-password");

    return res.json({ message: "Successful", result: requiredProperty });
  } catch (error) {
    return next(error);
  }
};

module.exports = createFeatured;
