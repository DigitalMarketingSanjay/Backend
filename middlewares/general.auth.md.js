const Error = require("../utils/Error");
const jwt = require("jsonwebtoken");

const authCheck = async (req, res, next) => {
  try {
    if (!req.headers.authorization) throw new Error("Failed to authorize", 401);
    const decoded = await jwt.verify(
      req.headers.authorization.split(" ")[1],
      process.env.JWT_SECRET
    );
    if (!decoded) throw new Error("Invalid authorization token", 401);

    const id = decoded.id;
    if (!id) {
      throw new Error("Invalid authorization token", 401);
    }
    req.bearedId = id;
    return next();
  } catch (error) {
    return next(error);
  }
};

module.exports = authCheck;
