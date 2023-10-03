const propertyModel = require("../../../models/property/property.model");

const getPropertyOfPremiumAgents = async (req, res) => {
  try {
    propertyModel
      .find({})
      .populate({
        path: "agentId",
      })
      .exec((err, properties) => {
        if (err) {
          console.error("Error fetching properties:", err);
          return res.status(500).send({ success: false, error: err });
        } else {
          // return res.status(200).send({ property: properties });
          // Categorize properties based on plan type
          const categorizedProperties = {
            ultimate: [],
            elite: [],
            pro: [],
            starter: [],
            other: [],
          };

          properties.forEach((property) => {
            if (property.agentId) {
              const planType = property?.agentId?.plan?.name;
              if (!planType) {
                categorizedProperties.other.push(property);
              } else if (planType === "elite") {
                categorizedProperties.elite.push(property);
              } else if (planType === "pro") {
                categorizedProperties.pro.push(property);
              } else if (planType === "starter") {
                categorizedProperties.starter.push(property);
              } else if (planType === "ultimate") {
                categorizedProperties.starter.push(property);
              }
            }
          });

          const premiumProperties = [
            ...categorizedProperties.ultimate,
            ...categorizedProperties.elite,
            ...categorizedProperties.pro,
            ...categorizedProperties.starter,
            ...categorizedProperties.other,
          ];

          return res.status(200).send({
            success: true,
            message: "Properties fetched successfully",
            data: premiumProperties,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getPropertyOfPremiumAgents;
