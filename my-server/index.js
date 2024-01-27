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
    origin:'http://localhost:4200',
    credentials:true
}));

// Routes setup
const roleRoutes = require('./routes/role.js');
app.use('/role', roleRoutes);
const AuthRoute = require('./routes/auth.js')
app.use('/auth', AuthRoute)
const UserRoute = require('./routes/user.js');
app.use('/user', UserRoute)

// Default route
app.get('/', (req, res) => {
    res.send('This Web server is processed for MongoDB');
});

// Error handling middleware
app.use((obj, req, res, next) => {
    const statusCode = obj.status || 500;
    const errorMessage = obj.message || "Something went wrong";
    return res.status(statusCode).json({
        success: [200, 201, 204].some(a => a === obj.status) ? true : false,
        status: statusCode,
        message: errorMessage,
        data: obj.data
    })
})

// Start the server
app.listen(process.env.PORT || 3002, () => {
    connectMongoDB();
    console.log(`My Server listening on port ${process.env.PORT || 3002}`);
});

