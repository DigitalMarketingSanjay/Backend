const PropertyModel = require("../../../models/property/property.model");
const { remove } = require("../../../S3");
const { startSession } = require("mongoose");
const Error = require("../../../utils/Error");

const deleteImageFromProperty = async (req, res, next) => {
  try {
    const { propertyId, photoName } = req.body;

    const agentId = req.bearerId;
    if (!propertyId || !agentId || !photoName) {
      throw new Error("Required fields missing", 400);
    }

    const requiredProperty = await PropertyModel.findById(propertyId);

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }

    if (requiredProperty.agentId.toString() !== agentId) {
      throw new Error("You are not authorized for this operation", 403);
    }

    const s3Data = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `agent/${agentId}/properties/${propertyId}/${photoName}`,
    };
    await remove(s3Data);

    requiredProperty.propertyImages = requiredProperty.propertyImages.filter(
      (image) =>
        image !==
        `https://mypropertygo.s3.ap-south-1.amazonaws.com/agent/${agentId}/properties/${propertyId}/${photoName}`
    );
    await requiredProperty.save();

    return res.json({ message: "Successful", result: requiredProperty });
  } catch (error) {
    next(error);
  }
};
module.exports = deleteImageFromProperty;
