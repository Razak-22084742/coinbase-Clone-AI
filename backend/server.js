// server.js — Entry point for the Crypto App backend

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

dotenv.config();

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const cryptoRoutes = require("./routes/cryptoRoutes");

const app = express();

/* -------------------------
   GLOBAL ERROR HANDLERS
--------------------------*/
process.on("uncaughtException", (err) => {
  console.error("🔥 UNCAUGHT EXCEPTION:", err);
});

process.on("unhandledRejection", (err) => {
  console.error("🔥 UNHANDLED REJECTION:", err);
});

/* -------------------------
   MIDDLEWARE
--------------------------*/
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* -------------------------
   CORS CONFIG (SAFE)
--------------------------*/
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------------
   ROUTES
--------------------------*/
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api/crypto", cryptoRoutes);

/* -------------------------
   HEALTH CHECK
--------------------------*/
app.get("/", (req, res) => {
  res.json({ message: "Crypto App API is running 🚀" });
});

/* -------------------------
   START SERVER ONLY AFTER DB
--------------------------*/
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI;

/* -------------------------
   VALIDATE ENV FIRST
--------------------------*/
if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in environment variables!");
  process.exit(1);
}

/* -------------------------
   CONNECT DB + START SERVER
--------------------------*/
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:");
    console.error(err);
    process.exit(1);
  });
