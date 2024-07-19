
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const login = require("../routes/login.js");
const fetchData = require("../routes/fetchData.js");
const chatWithAi = require("../routes/chatWithAi.js");
const postReview = require("../routes/postReview.js");
const serverless = require('serverless-http');
require("dotenv").config();

// Connect to MongoDB
async function main() {
  await mongoose.connect(process.env.uri);
}

main().catch(err => console.log(err));

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(cookieParser());

// Routes
app.get("/api", (req, res) => {
  res.status(200).json({ message: "welcome back it has been a long time!!!" });
});

app.use("/api", login);
app.use("/api", fetchData);
app.use("/api", chatWithAi);
app.use("/api", postReview);

// Error handling
app.use((err, req, res, next) => {
  const { status, message } = err;
  res.status(status || 500).json({ message });
});

// Convert Express app to serverless function
module.exports.handler = serverless(app);
