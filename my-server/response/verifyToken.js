const jwt = require('jsonwebtoken');
const { CreateError } = require('./error');
const User = require('../models/users.js');

async function verifyToken(req, res, next) {
    try {
      const token = req.headers['authorization'];
  
      if (!token) {
        return res.json({ success: false, message: 'No token provided' });
      }
  
      jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
        if (err) {
          console.error('Error during token verification:', err);
          return next(CreateError(403, 'Token is not valid'));
        }
  
        if (!decoded || !decoded.id) {
          console.error('Error decoding token. Missing id property.');
          return next(CreateError(403, 'Token is not valid'));
        }
  
        req.decoded = decoded;
        next();
      });
    } catch (error) {
      console.error('Error during token verification:', error);
      return next(CreateError(500, 'Internal Server Error'));
    }
  }
  
  function verifyUser(req, res, next) {
   verifyToken(req,res,()=>{
    if (req.decoded && (req.params.id === req.decoded.id || req.decoded.isAdmin)) {
        next();
    } else {
        return next(CreateError(403, 'You are not authorized'));
   } })
}
function verifyAdmin(req, res, next) {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        return next(CreateError(403, 'You are not authorized'));
    }
}

module.exports = {
    verifyToken,
    verifyUser,
    verifyAdmin
};
