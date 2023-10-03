const Error = require("../../../utils/Error");
const AgentModel = require("../../../models/agent/agent.model");
const { upload, remove } = require("../../../S3");
const uuid = require("uuid").v4;
const { fileType } = require("../../../utils/util");

const changeProfilePhoto = async (req, res, next) => {
  try {
    const agentId = req.bearerId;
    const profilePhoto = req.file;

    if (!profilePhoto) {
      throw new Error("Please provide a photo", 400);
    }
    const requiredAgent = await AgentModel.findById(agentId);
    if (!requiredAgent) {
      throw new Error("The user does not exist", 404);
    }

    let tempArray = null;
    if (requiredAgent.profilePhoto) {
      tempArray = requiredAgent.profilePhoto.split("/");
    }

    //uploading property images...
    if (profilePhoto) {
      //upload files
      const agentFolderName = agentId;

      const filesNameSplit = profilePhoto.originalname.split(".");
      const fileName = filesNameSplit[0];
      const extension = filesNameSplit[filesNameSplit.length - 1];

      //check if file is an image file or not
      if (fileType(extension) !== "Image") {
        throw new Error("Please provide an image file", 400);
      }

      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `agent/${agentFolderName}/profile/${fileName}_${uuid()}.${extension}`,
        Body: profilePhoto.buffer,
      };
      const response = await upload(s3Data);
      if (await response.Location) {
        requiredAgent.profilePhoto = response.Location;
      }

      await requiredAgent.save();
    }

    //deleting previous profile photo
    if (tempArray) {
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${tempArray[3]}/${tempArray[4]}/profile/${tempArray[6]}`,
      };
      await remove(s3Data);
    }

    res.json({ message: "Successful", result: requiredAgent });
  } catch (error) {
    next(error);
  }
};

module.exports = changeProfilePhoto;
