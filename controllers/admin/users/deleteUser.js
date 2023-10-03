const UserModel = require("../../../models/user/user.model");
const PurchaseRequestModel = require("../../../models/purchaseRequest/purchaseRequest.model");
const PropertyModel = require("../../../models/property/property.model");
const Error = require("../../../utils/Error");
const { startSession } = require("mongoose");
const { remove } = require("../../../S3");

const deleteUser = async (req, res, next) => {
  const session = await startSession();

  try {
    session.startTransaction();

    const { id } = req.params;
    const adminId = req.bearerId;

    // if (!id || !adminId) {
    //   throw new Error("Required fields missing", 400);
    // }
    //delete user
    const requiredUser = await UserModel.findByIdAndDelete({ _id: id }).session(
      session
    );

    //finding purchase request of the user
    const purchaseRequests = await PurchaseRequestModel.find({
      user: id,
    }).select("property");

    //removing requests from properties
    for (const request of purchaseRequests) {
      const requiredProperty = await PropertyModel.findById(
        request.property.toString()
      ).select("purchaseRequests");
      requiredProperty.purchaseRequests.pull({ _id: request._id.toString() });
      await requiredProperty.save({ session });
    }

    //deleting users purchase requests
    await PurchaseRequestModel.deleteMany({ user: id }).session(session);

    //delete user profile photo
    const tempArray = requiredUser.profilePhoto?.split("/");
    if (tempArray) {
      const s3Data = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${tempArray[3]}/${tempArray[4]}/profile/${tempArray[6]}`,
      };
      await remove(s3Data);
    }

    await session.commitTransaction();
    //end transaction
    session.endSession();

    return res.json({ message: "Successful", result: requiredUser });
  } catch (error) {
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = deleteUser;
