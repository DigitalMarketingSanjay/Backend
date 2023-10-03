const blogModel = require("../../../models/blog/blog.model");

const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModel.find({}).sort({ _id: -1 });
    res.status(200).send({
      success: true,
      message: "All blogs fetched successfully",
      blogs: blogs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = getAllBlogs;
