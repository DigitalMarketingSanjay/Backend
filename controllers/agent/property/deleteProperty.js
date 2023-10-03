const AgentModel = require("../../../models/agent/agent.model");
const PropertyModel = require("../../../models/property/property.model");
const PurchaseRequestModel = require("../../../models/purchaseRequest/purchaseRequest.model");
const AreaModel = require("../../../models/area/area.model");

const Error = require("../../../utils/Error");
const { startSession } = require("mongoose");
const { showFilesInFolder, removeMultipleFiles } = require("../../../S3");

const deleteProperty = async (req, res, next) => {
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();
    const { propertyId } = req.body;
    const agentId = req.bearerId;

    if (!propertyId || !agentId) {
      throw new Error("Required fields missing", 400);
    }

    //delete property doc
    const requiredProperty = await PropertyModel.findByIdAndDelete(
      propertyId
    ).session(session);

    if (!requiredProperty) {
      throw new Error("The property does not exist", 404);
    }
    if (requiredProperty.agentId.toString() !== agentId) {
      throw new Error("You are not authorized for this operation", 403);
    }
    //remove property from area properties array
    const requiredArea = await AreaModel.findById(
      requiredProperty.area.areaId.toString()
    );

    if (requiredArea) {
      requiredArea.properties.pull({ _id: propertyId });
      await requiredArea.save({ session });
    }

    // deleting all purchase requests for the property
    for (const request of requiredProperty.purchaseRequests) {
      await PurchaseRequestModel.deleteOne({
        _id: request.toString(),
      }).session(session);
    }

    //remove the property for agent properties list
    const requiredAgent = await AgentModel.findById(agentId).select(
      "properties"
    );
    if (!requiredAgent) {
      throw new Error("The agent does not exist", 404);
    }
    requiredAgent.properties.pull({ _id: propertyId });
    await requiredAgent.save({ session });

    //delete folder of property
    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `agent/${agentId}/properties/${propertyId}`,
    };
    const listedObjects = await showFilesInFolder(listParams);

    if (listedObjects) {
      const deleteParams = {
        Bucket: process.env.AWS_BUCKET_NAME,
        Delete: { Objects: [] },
      };
      listedObjects.forEach(({ Key }) => {
        deleteParams.Delete.Objects.push({ Key });
      });

      await removeMultipleFiles(deleteParams);
    }

    await session.commitTransaction();
    //end transaction
    session.endSession();
    return res.json({ message: "Successful", result: null });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = deleteProperty;
