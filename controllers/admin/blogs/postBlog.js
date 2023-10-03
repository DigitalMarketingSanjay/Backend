const blogModel = require("../../../models/blog/blog.model");
const { upload } = require("../../../S3");
const { fileType } = require("../../../utils/util");
const uuid = require("uuid").v4;
const sharp = require("sharp");

const postBlog = async (req, res) => {
  try {
    const { tittle, description, tags, metaDescription } = req.body;
    const blogImages = req?.files;

    //uploading property images...
    if (blogImages && blogImages.length > 0) {
      //upload files
      const filesList = [];
      //   const agentFolderName = userId;

      for (let mediaFile of blogImages) {
        const filesNameSplit = mediaFile.originalname.split(".");
        const fileName = filesNameSplit[0];
        const extension = filesNameSplit[filesNameSplit.length - 1];

        //check if file is an image file or not
        if (fileType(extension) !== "Image") {
          continue;
        }
        // const s3Data = {
        //   Bucket: process.env.AWS_BUCKET_NAME,
        //   Key: `agent/properties/${fileName}_${uuid()}.${extension}`,
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
          Key: `agent/properties/${fileName}_${uuid()}.webp`,
          Body: compressedImageBuffer,
        };

        // await upload(webpS3Data);
        const response = await upload(webpS3Data);
        if (await response.Location) {
          filesList.push(response.Location);
        }
      }
      var blogImage = filesList;
    }
    const blog = new blogModel({
      tittle,
      description,
      blogImage,
      tags,
      metaDescription,
    });
    await blog.save();
    res.status(200).send({
      success: true,
      message: "blog posted successfully",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = postBlog;
