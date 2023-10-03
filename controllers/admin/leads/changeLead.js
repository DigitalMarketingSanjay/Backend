const adminModel = require("../../../models/admin/admin.model");
const userModel = require("../../../models/user/user.model");

const changeLead = async (req, res) => {
  try {
    const { leadId, newAgentId } = req.body;
    const adminId = req.bearerId;
    // const adminId = "64bbba044cd4c09fc77762e9";
    if (!leadId || !newAgentId) {
      return res
        .status(400)
        .send({ success: false, message: "All fields are required" });
    }

    const newAgent = await userModel.findById({ _id: newAgentId });
    const admin = await adminModel.findById({ _id: adminId });

    admin.leads.map((element) => {
      if (element._id.toString() === leadId) {
        element.agentId = newAgentId;
        element.agentName = newAgent.name;
        newAgent.leads.push(element);
      }
    });
    await admin.save();
    await newAgent.save();
    admin.plans.map((element) => {
      if (element.userId.toString() === newAgentId) {
        element.leadCount = newAgent.leads.length;
      }
    });
    await admin.save();
    res.status(200).send({
      success: true,
      message: "lead changed successfully",
      adminLeads: admin.leads,
      newAgentLeads: newAgent.leads,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, error: error.message });
  }
};

module.exports = changeLead;
