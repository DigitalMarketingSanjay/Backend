const blogModel = require("../../../models/blog/blog.model");

const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModel.findByIdAndDelete({ _id: id });
    res.status(200).send({
      success: true,
      message: "Blog deleted successfully",
      blog: blog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = deleteBlog;
