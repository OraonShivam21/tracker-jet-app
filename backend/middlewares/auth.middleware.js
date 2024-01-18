const jwt = require("jsonwebtoken");
const { BlacklistModel } = require("../models/blacklist.model");

const auth = async (req, res, next) => {
  const access_token = req.headers.authorization?.split(" ")[1];
  try {
    if (!access_token) throw "Access token missing";

    const blacklistedToken = await BlacklistModel.findOne({
      token: access_token,
    });
    if (blacklistedToken) throw "Unauthorized: You're not authorized";

    const decoded = jwt.verify(access_token, process.env.accessSecret);
    if (!decoded) throw "Unauthorized: You're not authorized";
    req.body.userID = decoded.userID;
    req.body.user = decoded.user;
    next();
  } catch (error) {
    res.status(400).json({ error });
  }
};

module.exports = {
  auth,
};
