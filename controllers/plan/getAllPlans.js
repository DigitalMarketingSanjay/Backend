const planModel = require("../../models/plan/plan.model");

const getAllPlans = async (req, res) => {
  try {
    const plans = await planModel.find({});
    res.status(200).send({
      success: true,
      message: "plans fetched successfully",
      plans: plans,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = getAllPlans;
