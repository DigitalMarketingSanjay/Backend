const planModel = require("../../../models/plan/plan.model");
const propertyModel = require("../../../models/property/property.model");

const getAllPropertiesByAdmin = async (req, res) => {
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
      .sort({ _id: -1 })
      .exec((err, properties) => {
        if (err) {
          console.error("Error fetching properties:", err);
          return res.status(500).send({ success: false, error: err });
        } else {
          const paginatedProperties = properties.slice(startIndex, endIndex);
          return res.status(200).send({
            success: true,
            message: "Properties fetched successfully",
            data: properties,
            pageData: paginatedProperties,
            totalPages: Math.ceil(properties.length / limit),
            currentPage: page,
          });
        }
      });
  } catch (error) {
    console.log(error);
  }
};

module.exports = getAllPropertiesByAdmin;
