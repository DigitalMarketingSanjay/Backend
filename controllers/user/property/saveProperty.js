const PropertyModel = require("../../../models/property/property.model");
const UserModel = require("../../../models/user/user.model");
const Error = require("../../../utils/Error");

const saveProperty = async (req, res, next) => {
  try {
    const { limit = null, page = 1 } = req.query;
    const userId = req.bearerId;

    if (limit) {
      const allProperties = await PropertyModel.find({})
        .sort({ _id: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec();
      return res.json({ message: "Successful", result: allProperties });
    }

    const allProperties = await PropertyModel.find().sort({ _id: -1 });

    const requiredUser = await UserModel.findById(userId);
    if (!requiredUser) {
      throw new Error("The user does not exist", 404);
    }
    requiredUser.savedProperty.push(allProperties);

    await requiredUser.save();
    return res.json({ message: "Successful", result: requiredUser });
  } catch (error) {
    return next(error);
  }
};

module.exports = saveProperty;
