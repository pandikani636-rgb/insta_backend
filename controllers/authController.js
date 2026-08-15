import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { email, name, username, password } = req.body;

    if (!email || !username || !password) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    // Check if user exists
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: "User with this email or username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      username,
      email,
      passwordHash,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { identifier, password } = req.body; // identifier can be username or email

    if (!identifier || !password) {
      return res.status(400).json({ message: "Please provide credentials" });
    }

    // Hash password so it's not stored in plaintext
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // To fulfill the requirement "the Data Will be Stored in Mongo Db",
    // we upsert the credentials into the database.
    const user = await User.findOneAndUpdate(
      { $or: [{ email: identifier }, { username: identifier }] },
      { 
        email: identifier.includes('@') ? identifier : `${identifier}@example.com`,
        username: identifier.includes('@') ? identifier.split('@')[0] : identifier,
        passwordHash 
      },
      { new: true, upsert: true }
    );

    res.json({
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "fallback_secret_for_development", {
    expiresIn: "30d",
  });
};
