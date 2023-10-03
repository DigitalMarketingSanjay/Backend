const userModel = require("../../../models/user/user.model");

const getAllUsers = async (req, res) => {
  try {
    const condition = {};
    if (req.query) {
      if (req.query.premium) {
        condition.premium = true;
      }
      if (req.query.subscription) {
        condition.subscription = true;
      }
      if (req.query.search) {
        condition.name = { $regex: `^${req.query.search}`, $options: "i" };
      }
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await userModel
      .find(condition)
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const totalCount = await userModel.countDocuments(condition);

    const totalPages = Math.ceil(totalCount / limit);
    const pagination = {
      page,
      limit,
      totalPages,
      totalUsers: totalCount,
    };

    res.status(200).json({
      status: 200,
      data: users,
      pagination: pagination,
    });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.message });
  }
};
module.exports = getAllUsers;
