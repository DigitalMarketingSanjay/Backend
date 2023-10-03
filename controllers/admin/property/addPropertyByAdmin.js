const AgentModel = require("../../../models/agent/agent.model");
const PropertyModel = require("../../../models/property/property.model");
const LocationModel = require("../../../models/location/location.model");
const AreaModel = require("../../../models/area/area.model");
const Error = require("../../../utils/Error");
const { upload } = require("../../../S3");
const { startSession } = require("mongoose");
const { fileType } = require("../../../utils/util");
const userModel = require("../../../models/user/user.model");
const slugify = require("slugify");
const sharp = require("sharp");
const uuid = require("uuid").v4;
const nodemailer = require("nodemailer");
const adminModel = require("../../../models/admin/admin.model");
require("dotenv").config();

// Nodemailer configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

const addPropertyByAdmin = async (req, res, next) => {
  const session = await startSession();

  try {
    session.startTransaction();
    const {
      name,
      toggle,
      userType,
      authority,
      buildingType,
      cost,
      description,
      size,
      availableFor,
      BHKconfig,
      areaValue,
      areaType,
      liftFacility,
      additionalRooms,
      possessionStatus,
      furnishingStatus,
      ageOfProperty,
      numOfBathroom,
      numOfParking,
      view,
      floorNo,
      towerBlock,
      floorCount,
      unitNo,
      amenities = [],
      lat,
      lng,
      location,
      locationId,
      area,
      propertyType, //property type: pg,villa,appartment
      areaId,
      address,
      propertyTags,
    } = req.body;

    const adminId = req.bearerId;
    // const adminId = "64b11dec953854d49f5623fc";
    const user = await adminModel.findById({ _id: adminId });

    // if (
    //   !name ||
    //   !cost ||
    //   !description ||
    //   !size ||
    //   !availableFor ||
    //   !userId ||
    //   !BHKconfig ||
    //   !amenities ||
    //   !location ||
    //   // !locationId ||
    //   !area ||
    //   // !areaId ||
    //   !address ||
    //   !propertyType
    // ) {
    //   throw new Error("Required fields missing", 400);
    // }

    // Generate slug from the property name
    // const slug = slugify(name, { lower: true });

    const propertyPhotos = req?.files["photos"];
    const primaryImage = req?.files["primaryImage"];

    const coordinates = { lat, lng };
    const newProperty = new PropertyModel({
      name,
      toggle,
      userType,
      authority,
      buildingType,
      cost,
      description,
      size,
      availableFor,
      BHKconfig,
      areaValue,
      areaType,
      liftFacility,
      additionalRooms,
      possessionStatus,
      furnishingStatus,
      ageOfProperty,
      numOfBathroom,
      numOfParking,
      view,
      floorNo,
      towerBlock,
      floorCount,
      unitNo,
      amenities,
      propertyType,
      coordinates,
      location: { name: location, locationId: locationId },
      area: { name: area, areaId: areaId },
      address,
      agentId: adminId,
      propertyTags,
      // agentProfile: userProfile,
    });

    await newProperty.save({ session });
    const slugParts = [
      newProperty._id.toString(),
      BHKconfig + "bhk",
      propertyType,
    ];
    // console.log(slugParts);
    const slug = slugParts
      .map((part) => slugify(part, { lower: true }))
      .join("-");
    const formattedSlug = `${slug}-for-${availableFor}-in-${location.toLowerCase()}`;
    newProperty.slug = formattedSlug;
    await newProperty.save({ session });

    //uploading property images...
    if (propertyPhotos && propertyPhotos.length > 0) {
      //upload files
      const filesList = [];
      const agentFolderName = adminId;

      for (let mediaFile of propertyPhotos) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];

        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }

        // Compress and save the image in WebP format
        const compressedImageBuffer = await sharp(mediaFile.buffer)
          .webp({ quality: 80 }) // You can adjust the quality value
          .toBuffer();

        const webpS3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `agent/${agentFolderName}/properties/${newProperty.id.toString()}/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };

        // await upload(webpS3Data);
        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }

      newProperty.propertyImages = filesList;
      await newProperty.save({ session });
    }

    //uploading primary images...
    if (primaryImage && primaryImage.length > 0) {
      //upload files
      const filesList = [];
      const agentFolderName = adminId;

      for (let mediaFile of primaryImage) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];

        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }

        // Compress and save the image in WebP format
        const compressedImageBuffer = await sharp(mediaFile.buffer)
          .webp({ quality: 80 }) // You can adjust the quality value
          .toBuffer();

        const webpS3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `agent/${agentFolderName}/properties/${newProperty.id.toString()}/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };

        // await upload(webpS3Data);
        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }

      newProperty.primaryImage = filesList[0];
      await newProperty.save({ session });
    }

    //adding property id in agent schema

    // const requiredUser = await userModel.findById(userId);
    // if (!requiredUser) {
    //   throw new Error("The user does not exist", 404);
    // }
    // requiredUser.properties.push(newProperty);
    // await requiredUser.save({ session });

    await session.commitTransaction();
    //end transaction
    session.endSession();

    return res.json({ message: "Successful", result: newProperty });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};
module.exports = addPropertyByAdmin;
