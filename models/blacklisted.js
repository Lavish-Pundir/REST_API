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
blacklistedTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // auto delete after expiry


export const Blacklisted = mongoose.model("BlacklistedToken", blacklistedTokenSchema);
