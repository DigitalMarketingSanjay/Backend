const planModel = require("../../models/plan/plan.model");

const addPlan = async (req, res) => {
  try {
    const { name, price, tags, numOfLeads, text } = req.body;
    if (!price || !tags || !numOfLeads || !text) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }
    const plan = await new planModel({ name, price, tags, numOfLeads, text });
    await plan.save();
    res
      .status(200)
      .send({ success: true, message: "plan saved successfully", plan: plan });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = addPlan;
