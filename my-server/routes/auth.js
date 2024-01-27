const express = require('express');
const router = express.Router();
const { register, login, registerAdmin, sendEmail, resetPassword, loginAdmin, getProfile, updateProfile } = require('../controllers/auth.controllers.js');
const jwt = require('jsonwebtoken');
const { verifyUser, verifyToken } = require('../response/verifyToken.js');

// Register route
router.post('/register', register);
// Login route
router.post('/login', login);
// Register as admin
router.post('/register-admin', registerAdmin);
//Get user profile
router.get('/profile',verifyToken,getProfile);
//Edit user profile
router.put('/profile', verifyToken, updateProfile);
// Send email reset
router.post('/send-email', sendEmail);

router.post('/reset-password', resetPassword);
module.exports = router;
