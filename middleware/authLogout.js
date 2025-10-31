import jwt from "jsonwebtoken";
import { Blacklisted } from "../models/token.js";


export const  BlacklistedToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const expiresAt = new Date(decoded.exp * 1000); // Convert to milliseconds

        const blacklistedToken = new Blacklisted({ 
            token,
            expiresAt,
        });
        await blacklistedToken.save();
        res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};