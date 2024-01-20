const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");

const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  try {
    if (!token) throw "Access token missing";

    const blacklistedToken = await BlacklistModel.findOne({
      token: token,
    });
    if (blacklistedToken) throw "Unauthorized: You're not authorized";

    const decoded = jwt.verify(token, process.env.accessSecret);
    if (!decoded) throw "Unauthorized: You're not authorized";
    req.body.userID = decoded.userId;
    req.body.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  auth,
};
