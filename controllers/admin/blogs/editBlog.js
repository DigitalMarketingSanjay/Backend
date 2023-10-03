const blogModel = require("../../../models/blog/blog.model");

const editBlog = async (req, res) => {
  try {
    const { id, tittle, description, tags, metaDescription } = req.body;
    const blog = await blogModel.findByIdAndUpdate(
      { _id: id },
      { tittle, description, tags, metaDescription }
    );
    const updatedBlog = await blogModel.findById({ _id: id });
    res.status(200).send({
      success: true,
      message: "Blog updated successfully",
      updatedBlog: updatedBlog,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ success: false, error: error.message });
  }
};
module.exports = editBlog;
