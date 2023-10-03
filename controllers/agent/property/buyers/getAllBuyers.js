const PurchaseRequestModel = require("../../../../models/purchaseRequest/purchaseRequest.model");
const Error = require("../../../../utils/Error");

const getAllBuyers = async (req, res, next) => {
  try {
    const agentId = req.bearerId;
    if (!agentId) throw new Error("Please provide a agent id", 400);

    const requiredPurchaseRequest = await PurchaseRequestModel.find({
      agent: agentId,
    })
      .populate({ path: "user", select: "-password" })
      .populate({ path: "property" });

    return res.json({ message: "Successful", result: requiredPurchaseRequest });
  } catch (error) {
    next(error);
  }
};

module.exports = getAllBuyers;
