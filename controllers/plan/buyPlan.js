const adminModel = require("../../models/admin/admin.model");
const planModel = require("../../models/plan/plan.model");
const userModel = require("../../models/user/user.model");
const { upload } = require("../../S3");
const { fileType } = require("../../utils/util");
const uuid = require("uuid").v4;
const sharp = require("sharp");

const buyPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const userId = req.bearerId;
    // const userId = "6492a6ea50f97cf534be6d7c";
    const admin = await adminModel.findById({
      _id: "64bbba044cd4c09fc77762e9",
    });
    const user = await userModel.findById({ _id: userId });
    const plan = await planModel.findById({ _id: planId });
    if (user) {
      user.subscription = true;
      await user.save();
    }

    const screenshots = req?.files;

    //uploading screenshot images...
    if (screenshots && screenshots.length > 0) {
      //upload files
      const filesList = [];
      const agentFolderName = userId;

      for (let mediaFile of screenshots) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];

        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }
        // const s3Data = {
        //   Bucket: process.env.AWS_BUCKET_NAME,
        //   Key: `agent/${agentFolderName}/properties/${fileName}_${uuid()}.${extension}`,
        //   Body: mediaFile.buffer,
        // };
        // const response = await upload(s3Data);
        // if (await response.Location) {
        //   filesList.push(response.Location);
        // }
        const compressedImageBuffer = await sharp(mediaFile.buffer)
          .webp({ quality: 80 }) // You can adjust the quality value
          .toBuffer();

        const webpS3Data = {
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `agent/${agentFolderName}/properties/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };

        // await upload(webpS3Data);
        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }
      var screenshot = filesList;
    }
    const obj = {
      userId,
      planId,
      userName: user.name,
      userEmail: user.email,
      leadCount: user.leadCount,
      planName: plan.name,
      price: plan.price,
      screenshot,
    };
    admin?.plans?.push(obj);

    await admin.save();
    res.status(200).send({
      success: true,
      message: "plans details sent to the admin",
      plan: admin.plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = buyPlan;
