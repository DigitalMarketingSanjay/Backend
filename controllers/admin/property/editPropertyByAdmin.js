const PropertyModel = require("../../../models/property/property.model");
const Error = require("../../../utils/Error");
const { startSession } = require("mongoose");
const { upload } = require("../../../S3");
const slugify = require("slugify");
const sharp = require("sharp");
const uuid = require("uuid").v4;
const { fileType } = require("../../../utils/util");

const editPropertyByAdmin = async (req, res, next) => {
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();
    const {
      propertyId,
      name,
      toggle,
      buildingType,
      cost,
      description,
      size,
      availableFor,
      BHKconfig,
      areaValue,
      areaType,
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
      metaTittle,
      metaDescription,
    } = req.body;

    // const agentId = req.bearerId;
    if (!propertyId) {
      throw new Error("Please provide a property id", 400);
    }

    const requiredProperty = await PropertyModel.findById(propertyId);

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }

    const propertyPhotos = req?.files["photos"];
    const primaryImage = req?.files["primaryImage"];

    //uploading property images...
    if (propertyPhotos && propertyPhotos.length > 0) {
      //upload files
      const filesList = [];
      const agentFolderName = propertyId;

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
          Key: `agent/${agentFolderName}/properties/${requiredProperty.id.toString()}/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };
        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }

      requiredProperty.propertyImages.push(...filesList);
      // await requiredProperty.save({ session });
    }

    //uploading primary images...
    if (primaryImage && primaryImage.length > 0) {
      //upload files
      const filesList = [];
      const agentFolderName = propertyId;

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
          Key: `agent/${agentFolderName}/properties/${requiredProperty.id.toString()}/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };

        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }

      requiredProperty.primaryImage = filesList[0];
      // await requiredProperty.save({ session });
    }

    //updating the information
    if (name) requiredProperty.name = name;
    if (toggle) requiredProperty.toggle = toggle;
    if (buildingType) requiredProperty.buildingType = buildingType;
    if (cost) requiredProperty.cost = cost;
    if (description) requiredProperty.description = description;
    if (size) requiredProperty.size = size;
    if (availableFor) requiredProperty.availableFor = availableFor;
    if (BHKconfig) requiredProperty.BHKconfig = BHKconfig;
    if (areaValue) requiredProperty.areaValue = areaValue;
    if (areaType) requiredProperty.areaType = areaType;
    if (additionalRooms) requiredProperty.additionalRooms = additionalRooms;
    if (possessionStatus) requiredProperty.possessionStatus = possessionStatus;
    if (furnishingStatus) requiredProperty.furnishingStatus = furnishingStatus;
    if (ageOfProperty) requiredProperty.ageOfProperty = ageOfProperty;
    if (numOfBathroom) requiredProperty.numOfBathroom = numOfBathroom;
    if (numOfParking) requiredProperty.numOfParking = numOfParking;
    if (view) requiredProperty.view = view;
    if (floorNo) requiredProperty.floorNo = floorNo;
    if (towerBlock) requiredProperty.towerBlock = towerBlock;
    if (floorCount) requiredProperty.floorCount = floorCount;
    if (unitNo) requiredProperty.unitNo = unitNo;
    if (amenities) requiredProperty.amenities = amenities;
    if (propertyType) requiredProperty.propertyType = propertyType;
    if (location)
      requiredProperty.location = { name: location, locationId: locationId };
    if (area) requiredProperty.area = { name: area, areaId: areaId };
    if (address) requiredProperty.address = address;
    if (propertyTags) requiredProperty.propertyTags = propertyTags;
    if (metaTittle) requiredProperty.metaTittle = metaTittle;
    if (metaDescription) requiredProperty.metaDescription = metaDescription;
    await requiredProperty.save({ session });

    await session.commitTransaction();
    //end transaction
    session.endSession();

    return res.json({ message: "Successful", result: requiredProperty });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return next(error);
  }
};

module.exports = editPropertyByAdmin;
