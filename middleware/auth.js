import jwt from "jsonwebtoken";
import { User } from "../models/model.js";
import { Blacklisted } from "../models/blacklisted.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //  Step 1: Check header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authorization header missing or malformed" });
    }

    //  Step 2: Extract token
    const token = authHeader.split(" ")[1];

    //  Step 3: Check if token is blacklisted (logged out)
    const isBlacklisted = await Blacklisted.findOne({ token });
    if (isBlacklisted) {
      return res.status(401).json({ message: "Token is blacklisted. Please log in again." });
    }

    //  Step 4: Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Step 5: Find user in DB
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "Unauthorized: User not found" });
    }

    //  Step 6: Attach user to request object
    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token", error: error.message });
  }
};