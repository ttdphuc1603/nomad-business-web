// user.js
const express = require('express');
const { getAllUsers, getbyId, Updateuser, deleteuser } = require('../controllers/user.controllers.js');
const { verifyAdmin, verifyUser } = require('../response/verifyToken.js'); 


const router = express.Router();

// Lấy tất cả người dùng
router.get('/', getAllUsers);

// Lấy theo ID
router.get('/:id',getbyId);

module.exports = router;
