const AgentModel = require("../../../models/agent/agent.model");
const PropertyModel = require("../../../models/property/property.model");
const PurchaseRequestModel = require("../../../models/purchaseRequest/purchaseRequest.model");
const AreaModel = require("../../../models/area/area.model");

const Error = require("../../../utils/Error");
const { startSession } = require("mongoose");
const { showFilesInFolder, removeMultipleFiles } = require("../../../S3");

const deleteAgent = async (req, res, next) => {
  const session = await startSession();
  try {
    //start transaction
    session.startTransaction();

    const { agentId } = req.body;
    if (!agentId) {
      throw new Error("Please provide an agent id", 400);
    }

    const requiredAgent = await AgentModel.findByIdAndDelete(agentId)
      .select("properties profilePhoto")
      .session(session);

    if (!requiredAgent) {
      throw new Error("The agent does not exist", 404);
    }
    //delete properties of agent

    for (const propertyId of requiredAgent?.properties) {
      //delete property doc
      const requiredProperty = await PropertyModel.findByIdAndDelete(
        propertyId
      ).session(session);

      // remove property from area properties array
      if (requiredProperty?.area != null) {
        const requiredArea = await AreaModel.findById(
          requiredProperty.area.areaId
        );
        if (requiredArea) {
          const index = requiredArea.properties.indexOf(propertyId);
          if (index > -1) {
            requiredArea.properties.splice(index, 1);
          }
          console.log(requiredArea.properties);
          await requiredArea.save();
        }
      }

      // deleting all purchase requests for the property
      if (requiredProperty?.purchaseRequests != null) {
        for (const request of requiredProperty.purchaseRequests) {
          await PurchaseRequestModel.deleteOne({
            _id: request.toString(),
          }).session(session);
        }
      }
    }

    //delete folder of agent
    const listParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `agent/${agentId}`,
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
    console.log(error);
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};

module.exports = deleteAgent;
