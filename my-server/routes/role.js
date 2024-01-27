const express = require('express');
const router = express.Router();
const Role = require('../models/role');
const { updateRole, createRole, getallRole, deleteRole } = require('../controllers/role.controllers.js');
const { verifyAdmin } = require('../response/verifyToken.js');

// Helper function for consistent response structure
const sendResponse = (res, status, data) => {
    res.status(status).json(data);
};

router.post('/create', verifyAdmin,createRole);
router.put('/update/:id',verifyAdmin,updateRole);
router.get('/get',verifyAdmin,getallRole)
router.delete('/delete/:id',verifyAdmin,deleteRole)
module.exports = router;
