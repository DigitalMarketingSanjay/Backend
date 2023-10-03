const LocationModel = require("../../../models/location/location.model");
const Error = require("../../../utils/Error");
const { upload } = require("../../../S3");
const { startSession } = require("mongoose");
const { fileType } = require("../../../utils/util");
const uuid = require("uuid").v4;

const addNewLocation = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("Please provide location name", 400);
    }

    const exestingLocation = await LocationModel.findOne({ name: name });

    if (exestingLocation) {
      throw new Error("The location already exist", 400);
    }
    // const productPhotos = req?.files["photos"];
    // //updating service images...
    // if (productPhotos && productPhotos.length > 0) {
    //   //upload files
    //   const filesList = [];
    //   for (let mediaFile of productPhotos) {
    //     const filesNameSplit = mediaFile.originalname.split(".");
    //     const fileName = filesNameSplit[0];
    //     const extension = filesNameSplit[filesNameSplit.length - 1];
    //     //check if file is an image file or not
    //     if (fileType(extension) !== "Image") {
    //       continue;
    //     }
    //     const s3Data = {
    //       Bucket: process.env.AWS_BUCKET_NAME,
    //       Key: `property/locations/${fileName}_${uuid()}.${extension}`,
    //       Body: mediaFile.buffer,
    //     };
    //     const response = await upload(s3Data);
    //     if (await response.Location) {
    //       filesList.push(response.Location);
    //     }
    //   }
    //   var photos = filesList;
    // }
    const newLocation = new LocationModel({
      name: name,
      areas: [],
      // locationImages: photos,
    });
    await newLocation.save();

    return res.json({ message: "Successful", result: newLocation });
  } catch (error) {
    next(error);
  }
};

module.exports = addNewLocation;
