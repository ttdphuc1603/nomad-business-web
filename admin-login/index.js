const express = require('express');
const { MongoClient } = require('mongodb');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser'); 
// Load environment variables from .env file
dotenv.config();

// MongoDB connection setup
const connectMongoDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log('Connected to Database');
    } catch (error) {
        throw error;
    }
};

// Express middleware setup
const app = express();
app.use(cookieParser())
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
    origin:'http://localhost:4201',
    credentials:true
}));
const adminRoutes=require('./admin')
app.use('/admin',adminRoutes)


// Default route
app.get('/', (req, res) => {
    res.send('This Web server is processed for MongoDB');
});

// Start the server
app.listen(process.env.PORT || 3004, () => {
    connectMongoDB();
    console.log(`My Server listening on port ${process.env.PORT || 3004}`);
});
