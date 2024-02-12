const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const userroute = require('./routes/userroute.js');
const chatroute= require('./routes/chatroute.js');

// Create Express application
const app = express();

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }))

// api route
app.use('/api/user/', userroute)

app.use('/api/chat/', chatroute)


// Connect to MongoDB
mongoose.connect(process.env.MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB...');
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });