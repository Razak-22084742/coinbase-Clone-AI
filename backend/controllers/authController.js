// controllers/authController.js — Handles user registration, login, and logout

const User = require("../models/User");
const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options — secure + sameSite='none' required in production for cross-origin cookies
const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
});

/**
 * registerUser — GET /api/register
 *
 * Reads from req.body first, falls back to req.query (supports JSON body and query params).
 * NOTE: The assignment specifies GET method for register. Credentials are sent via axios
 * as query params (?name=...&email=...&password=...) which Express reads from req.query.
 */
const registerUser = async (req, res) => {
  const name = req.body.name || req.query.name;
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (!name || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide name, email, and password" });
  }

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "An account with this email already exists" });
    }

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);

    // Set JWT as HTTP-only cookie so it's sent automatically on subsequent requests
    res.cookie("token", token, getCookieOptions());

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token, // also returned in body so frontend can store in localStorage as fallback
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during registration", error: error.message });
  }
};

/**
 * loginUser — GET /api/login
 *
 * Verifies credentials, signs a JWT, sets it as an HTTP-only cookie,
 * and also returns it in the response body.
 */
const loginUser = async (req, res) => {
  const email = req.body.email || req.query.email;
  const password = req.body.password || req.query.password;

  if (!email || !password) {
    return res.status(400).json({ message: "Please provide email and password" });
  }

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      const token = generateToken(user._id);

      res.cookie("token", token, getCookieOptions());

      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      return res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during login", error: error.message });
  }
};

/**
 * logoutUser — GET /api/logout
 *
 * Clears the HTTP-only cookie. The frontend should also clear localStorage.
 */
const logoutUser = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0), // immediately expire the cookie
  });
  return res.json({ message: "Logged out successfully" });
};

module.exports = { registerUser, loginUser, logoutUser };
