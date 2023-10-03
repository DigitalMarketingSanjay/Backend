const Error = require("../../../utils/Error");
const UserModel = require("../../../models/user/user.model");
const { upload, remove } = require("../../../S3");
const uuid = require("uuid").v4;
const { fileType } = require("../../../utils/util");

const changeProfilePhoto = async (req, res, next) => {
  try {
    const userId = req.bearerId;
    const profilePhoto = req.file;

    if (!profilePhoto) {
      throw new Error("Please provide a photo", 400);
    }
    const requiredUser = await UserModel.findById(userId);
    if (!requiredUser) {
      throw new Error("The user does not exist", 404);
    }

    let tempArray = null;
    if (requiredUser.profilePhoto) {
      tempArray = requiredUser.profilePhoto.split("/");
    }

    //uploading property images...
    if (profilePhoto) {
      //upload files
      const userFolderName = userId;

      const filesNameSplit = profilePhoto.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];

      //check if file is an image file or not
      if (fileType(extension) !== "Image") {
        throw new Error("Please provide an image file", 400);
      }

      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `user/${userFolderName}/profile/${fileName}_${uuid()}.${extension}`,
        Body: profilePhoto.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        requiredUser.profilePhoto = response.Location;
      }

      await requiredUser.save();
    }

    //deleting previous profile photo
    if (tempArray) {
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${tempArray[3]}/${tempArray[4]}/profile/${tempArray[6]}`,
      };
      await remove(s3Data);
    }

    res.json({ message: "Successful", result: requiredUser });
  } catch (error) {
    next(error);
  }
};

module.exports = changeProfilePhoto;
