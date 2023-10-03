const propertyModel = require("../../../models/property/property.model");

const deletePropertyImage = async (req, res) => {
  try {
    const { propertyId, imageUrl } = req.body;
    if (!propertyId || !imageUrl) {
      return res
        .status(400)
        .send({ success: false, message: "pass propertyId and imageUrl" });
    }
    const property = await propertyModel.findById({ _id: propertyId });
    const filteredImages = property?.propertyImages?.filter((url) => {
      console.log("url", url);
      return url != imageUrl;
    });
    property.propertyImages = filteredImages;
    await property.save();
    res.status(200).send({
      success: true,
      message: "image deleted successfully",
      data: property?.propertyImages,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};
module.exports = deletePropertyImage;
