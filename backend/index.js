// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
// Disaster Report Schema (for MongoDB)
const reportSchema = new mongoose.Schema({
  description: String,
  imageUrl: String,
  latitude: Number,
  longitude: Number,
  time: {
    type: Date,
    default: Date.now
  }
});


// Create Model
const Report = mongoose.model("Report", reportSchema);


// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// ✅ Replace this with your actual connection string
const mongoURI = process.env.MONGO_URI;


mongoose.connect(mongoURI)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Test route
app.get("/", (req, res) => {
  res.send("🚀 Disaster Alert System Backend is Running Successfully!");
});

// Start server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.get("/api/test", (req, res) => {
  res.json({ message: "Backend and Frontend are now connected successfully!" });
});
// ✅ POST route — to submit a new disaster report
app.post("/report", async (req, res) => {
  try {
    const { description, imageUrl, latitude, longitude } = req.body;
    const newReport = new Report({ description, imageUrl, latitude, longitude });
    await newReport.save();
    res.json({ message: "Report submitted successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Error submitting report" });
  }
});


// ✅ GET route — to fetch all reports
app.get("/reports", async (req, res) => {
  try {
    const reports = await Report.find().sort({ time: -1 });
    res.json(
      reports.map((r) => ({
        id: r._id,
        description: r.description,
        imageUrl: r.imageUrl,
        time: new Date(r.time).toLocaleString(),
      }))
    );
  } catch (error) {
    console.error("Error fetching reports:", error);
    res.status(500).json({ message: "Error fetching reports" });
  }
});


