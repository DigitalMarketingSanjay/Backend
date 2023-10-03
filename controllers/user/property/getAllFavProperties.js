const userModel = require("../../../models/user/user.model");

const getAllFavProperties = async (req, res) => {
  try {
    const userId = req.bearerId;
    // const userId = "63d7807f1856ff7b2f639446";
    userModel
      .findById(userId)
      .populate("favourites") // Populate the 'favourites' array with Property documents
      .exec((err, user) => {
        if (err) {
          console.error(err);
          return;
        }
        console.log(user.favourites);
        res.status(200).send({
          success: true,
          message: "fav properties fetched",
          favourites: user.favourites,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};
module.exports = getAllFavProperties;
