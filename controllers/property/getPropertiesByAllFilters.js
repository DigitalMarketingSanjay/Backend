const AreaModel = require("../../models/area/area.model");
const propertyModel = require("../../models/property/property.model");
const Error = require("../../utils/Error");

const getPropertiesByAllFilters = async (req, res, next) => {
  try {
    const {
      minPrice,
      maxPrice,
      availableFor,
      propertyType,
      BHKconfig,
      size,
      furnishingStatus,
      possessionStatus,
      ageOfProperty,
      numOfBathroom,
      numOfParking,
      toggle,
      location = [],
      amenities = [],
    } = req.body;

    // Build the filter object based on the provided fields
    const filter = {};
    filter.status = "active";

    if (propertyType) {
      filter.propertyType = propertyType;
    }
    if (availableFor) {
      filter.availableFor = availableFor;
    }
    if (furnishingStatus) {
      filter.furnishingStatus = furnishingStatus;
    }
    if (possessionStatus) {
      filter.possessionStatus = possessionStatus;
    }
    if (ageOfProperty) {
      filter.ageOfProperty = ageOfProperty;
    }
    if (numOfBathroom) {
      filter.numOfBathroom = numOfBathroom;
    }
    if (numOfParking) {
      filter.numOfParking = numOfParking;
    }
    if (toggle) {
      filter.toggle = toggle;
    }
    //filter by price
    if (minPrice !== undefined && maxPrice !== undefined) {
      filter.cost = { $gt: minPrice, $lt: maxPrice };
    } else if (minPrice !== undefined) {
      filter.cost = { $gt: minPrice };
    } else if (maxPrice !== undefined) {
      filter.cost = { $lt: maxPrice };
    }
    if (size) {
      filter.size = size;
    }

    if (BHKconfig) {
      filter.BHKconfig = BHKconfig;
    }

    if (amenities && amenities.length > 0) {
      filter.amenities = { $in: amenities };
    }

    if (location && location.length > 0) {
      filter["location.name"] = { $in: location };
    }

    // const properties = await propertyModel.find(filter);
    // console.log("filter", filter);

    propertyModel
      .find(filter)
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

          return res.status(200).send({
            success: true,
            message: "Properties fetched successfully",
            result: premiumProperties,
          });
        }
      });

    // return res.json({ message: "Successful", result: properties });
  } catch (error) {
    next(error);
  }
};

module.exports = getPropertiesByAllFilters;
