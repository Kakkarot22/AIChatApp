import jwt from "jsonwebtoken";
import redisclient from "../services/redis.service.js";

export const authUser = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized  token" });
    }
    const isBlacklisted = await redisclient.get(token);

    if (isBlacklisted) {
      console.log("blacklist check");
      res.cookie("token", "");
      return res.status(401).json({ message: "Unauthorized blacklist " });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: e.message });
  }
};
