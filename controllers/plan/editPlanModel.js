const planModel = require("../../models/plan/plan.model");

const editPlanModel = async (req, res) => {
  try {
    const { _id, name, price, tags, numofLeads, text } = req.body;
    const plan = await planModel.findByIdAndUpdate({ _id }, req.body);
    res.status(200).send({
      success: true,
      message: "plan updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};

module.exports = editPlanModel;
