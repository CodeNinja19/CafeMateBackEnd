const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(express.json());

// Define your routes
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel!' });
});

// Export serverless function
module.exports.handler = serverless(app);