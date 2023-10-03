const userModel = require("../../../models/user/user.model");

const addInFavourite = async (req, res) => {
  try {
    const { propertyId } = req.body;
    const userId = req.bearerId;
    // const userId = "63d7807f1856ff7b2f639446";
    const user = await userModel.findById({ _id: userId });
    if (!user) {
      return res
        .status(200)
        .send({ success: false, message: "User is not present" });
    }
    user.favourites.push(propertyId);
    await user.save();
    res.status(200).send({
      success: true,
      message: "added in favourite successfully",
      favourites: user.favourites,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: `${error.message}` });
  }
};
module.exports = addInFavourite;
