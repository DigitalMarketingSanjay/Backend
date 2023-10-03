const PropertyModel = require("../../../models/property/property.model");
const { upload } = require("../../../S3");
const { startSession } = require("mongoose");
const Error = require("../../../utils/Error");
const uuid = require("uuid").v4;
const { fileType } = require("../../../utils/util");

const addImageToProperty = async (req, res, next) => {
  try {
    const { propertyId } = req.body;

    const agentId = req.bearerId;
    if (!propertyId || !agentId)
      throw new Error("Required fields missing", 400);

    const propertyPhotos = req?.files;
    console.log(req.bodcy);
    console.log("gotit ", propertyPhotos);
    if (!propertyPhotos || propertyPhotos.length < 1) {
      throw new Error("Please provide a photo", 400);
    }

    const requiredProperty = await PropertyModel.findById(propertyId);

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }

    if (requiredProperty.agentId.toString() !== agentId) {
      throw new Error("You are not authorized for this operation", 403);
    }

    //uploading property images...
    if (propertyPhotos && propertyPhotos.length > 0) {
      //upload files
      const agentFolderName = agentId;

      for (let mediaFile of propertyPhotos) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];
        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }

        const s3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `agent/${agentFolderName}/properties/${requiredProperty.id.toString()}/${fileName}_${uuid()}.${extension}`,
          Body: mediaFile.buffer,
        };
        const response = await upload(s3Data);
        if (await response.Location) {
          requiredProperty.propertyImages.push(response.Location);
        }
      }
      await requiredProperty.save();
    }

    return res.json({ message: "Successful", result: requiredProperty });
  } catch (error) {
    return next(error);
  }
};

module.exports = addImageToProperty;
