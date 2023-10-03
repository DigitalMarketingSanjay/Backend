const planModel = require("../../../models/plan/plan.model");
const propertyModel = require("../../../models/property/property.model");

const getAllProperties = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Get the page number from the query, default to 1 if not provided
    const limit = parseInt(req.query.limit) || 10; // Get the limit from the query, default to 10 if not provided

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    propertyModel
      .find({})
      .populate({
        path: "agentId",
        populate: {
          path: "plan.planId",
          model: "Plan", // Change "Plan" to your actual plan model name
        },
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

          const paginatedProperties = premiumProperties.slice(
            startIndex,
            endIndex
          );
          return res.status(200).send({
            success: true,
            message: "Properties fetched successfully",
            data: premiumProperties,
            pageData: paginatedProperties,
            totalPages: Math.ceil(premiumProperties.length / limit),
            currentPage: page,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getAllProperties;
