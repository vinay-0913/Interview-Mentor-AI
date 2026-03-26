require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { chat } = require("./gemini");
const User = require("./models/User");

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));


app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  try {
    const { messages, mode } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required and must not be empty." });
    }

    if (!mode || !["DSA", "HR", "Behavioral"].includes(mode)) {
      return res.status(400).json({ error: "Mode must be one of: DSA, HR, Behavioral" });
    }

    const result = await chat(messages, mode);
    res.json(result);
  } catch (error) {
    console.error("Chat API error:", error.message);
    res.status(500).json({
      error: "Failed to get AI response. Please try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.post("/api/users/sync", async (req, res) => {
  try {
    const { clerkId, email, firstName, lastName } = req.body;
    
    if (!clerkId || !email) {
      return res.status(400).json({ error: "Missing clerkId or email" });
    }

    const user = await User.findOneAndUpdate(
      { clerkId },
      { clerkId, email, firstName, lastName },
      { new: true, upsert: true }
    );

    res.json({ message: "User synced successfully", user });
  } catch (error) {
    console.error("Error syncing user:", error.message);
    res.status(500).json({ error: "Failed to sync user" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Interview Mentor AI Backend running on http://localhost:${PORT}`);
});
