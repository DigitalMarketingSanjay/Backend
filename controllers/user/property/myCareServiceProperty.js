const propertyModel = require("../../../models/property/property.model");

const myCareServiceProperty = async (req, res) => {
  try {
    const userId = req.bearerId;
    // const userId = "640328eab864cfe774337f83";
    const properties = await propertyModel.find({ agentId: userId });
    const careProperty = properties.filter(
      (element) => element.careService === true
    );
    res.status(200).send({
      succeess: true,
      message: "properties with care true fetched",
      data: careProperty,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error });
  }
};

module.exports = myCareServiceProperty;
