const locationModel = require("../../../models/location/location.model");

const deleteLocation = async (req, res) => {
  try {
    const location = await locationModel.findByIdAndDelete({
      _id: req.params.id,
    });
    res.status(200).send({
      success: true,
      message: "location deleted successfully",
      location: location,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = deleteLocation;
