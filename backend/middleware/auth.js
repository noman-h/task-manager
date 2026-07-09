const jwt = require("jsonwebtoken");
const user = require("../model/userModel");

module.exports = async (req, res, next) => {
  try {
    const authtoken = req.headers.authorization;

    if (!authtoken) {
      return res.status(404).json("token is missing");
    }

    const token = authtoken.split(" ")[1];
    const decode = jwt.verify(token, process.env.secretkey);

    if (!decode) {
      return res.status(403).json({ message: "invalid token" });
    }

    const { email } = decode;
    const userdetail = await user.findOne({ email });
    if (!userdetail) {
      return res.status(404).json({ message: "user not found" });
    }

    req.user = userdetail;
    next();
  } catch (err) {
    if (err.message === "jwt expired") {
      return res.status(403).json(err);
    }

    return res.status(500).json(err);
  }
};
