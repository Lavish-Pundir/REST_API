import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token: {
         type: String,
          required: true,
           unique: true, 
        },
    expiresAt: {
        type: Date,
        required: true,
          default: Date.now,

     },
});

export const Blacklisted = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
