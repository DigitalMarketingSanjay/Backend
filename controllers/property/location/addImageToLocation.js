const LocationModel = require("../../../models/location/location.model");
const { upload } = require("../../../S3");
const { startSession } = require("mongoose");
const Error = require("../../../utils/Error");
const uuid = require("uuid").v4;
const { fileType } = require("../../../utils/util");

const addImageToLocation = async (req, res, next) => {
  try {
    const { locationId } = req.body;
    if (!locationId) throw new Error("Required fields missing", 400);

    const locationPhotos = req?.files;
    if (!locationPhotos || locationPhotos.length < 1) {
      throw new Error("Please provide a photo", 400);
    }

    const requiredLocation = await LocationModel.findById(locationId);

    if (!requiredLocation) {
      throw new Error("The location does not exist", 404);
    }

    // if (requiredLocation.agentId.toString() !== agentId) {
    //   throw new Error("You are not authorized for this operation", 403);
    // }

    //uploading property images...
    if (locationPhotos && locationPhotos.length > 0) {
      //upload files
      const agentFolderName = locationId;

      for (let mediaFile of locationPhotos) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];
        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }

        const s3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `agent/${agentFolderName}/locations/${requiredLocation.id.toString()}/${fileName}_${uuid()}.${extension}`,
          Body: mediaFile.buffer,
        };
        const response = await upload(s3Data);
        if (await response.Location) {
          requiredLocation.locationImages.push(response.Location);
        }
      }
      await requiredLocation.save();
    }

    return res.json({ message: "Successful", result: requiredLocation });
  } catch (error) {
    return next(error);
  }
};

module.exports = addImageToLocation;
