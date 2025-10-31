import jwt from 'jsonwebtoken';
import { User } from '../models/model.js';
import bcrypt from 'bcrypt';
import { Blacklisted } from '../models/token.js';

    // Signup API
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword  = await bcrypt.hash(password, 10);

        const newUser = new User({ 
            name,
            email,
            password: hashedPassword, 
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: newUser });

    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }   
};
  // Login API

export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const hashedPassword  = await bcrypt.compare(password, user.password);
        if (!hashedPassword) {
            return res.status(400).json({ message: "Invalid email or password" });
        }
        const token = jwt.sign(
            { userId: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '2h' }
        );
        res.status(200).json({ message: "Login successful", token, user });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
    // Get All Profiles API

export const getAllProfiles = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        return res.status(200).json({ message: "Profiles fetched successfully", users });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
  // Get Profile by ID API

export const getProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const user =await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile fetched successfully", user });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
 // Update Profile API

export const updateProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        if (updates.password) {
            updates.password = await bcrypt.hash(updates.password, 10); 
        }
        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true }).select("-password");
        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};
  // Delete Profile API

export const deleteProfile = async (req, res) => {
    try {
        const userId = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userId);
        if(!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "Profile deleted successfully", user: deletedUser });
    } catch (err) {
        return res.status(500).json({ message: "Server error", error: err.message });
    }
};


//  logout  API
export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "No token provided" });
        }
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

