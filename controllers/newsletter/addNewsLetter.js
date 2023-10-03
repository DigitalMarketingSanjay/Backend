const newsletterModel = require("../../models/newsletter/newsletterModel");

const addNewsLetter = async (req, res) => {
  try {
    const { email } = req.body;
    const news = await new newsletterModel({ email });
    await news.save();
    res.status(200).send({
      success: true,
      message: "email added successfully",
      data: news,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = addNewsLetter;
