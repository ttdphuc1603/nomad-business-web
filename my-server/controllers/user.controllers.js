const users = require("../models/users.js");
const {CreateError} = require('../response/error.js')
const{CreateSuccess}=require('../response/success.js')
const mongoose= require('mongoose')
// Get all users
module.exports.getAllUsers = async (req, res, next) => {
  try {
    const userList = await users.find();
    return res.status(200).json(CreateSuccess("All Users retrieved successfully", userList));
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json(CreateError("Internal Server Error"));
  }
};


// Get user by ID
module.exports.getbyId = async (req, res, next) => {
  try {
    const id = await users.findById(req.params.id);

    // Check if user is not found
    if (!id) {
      return res.status(404).json(CreateError("User not found"));
    }

    // Return the user with a success response
    return res.status(200).json(CreateSuccess("User retrieved successfully", id));
  } catch (error) {
    console.error("Error in getbyId:", error);
    return res.status(500).json(CreateError("Internal Server Error"));
  }}

  module.exports.Updateuser= async (req, res, next) => {
    try {
      const id = await users.findByIdAndUpdate(req.params.id,{
        $set:req.body}, { new: true });
      if (!id) {
        return res.status(404).json(CreateError("User not found"));
      }
      return res.status(200).json(CreateSuccess("User updated successfully", id));
    } catch (error) {
      return res.status(500).json(CreateError("Internal Server Error"));
    }
  }
  module.exports.deleteuser=async (req, res, next) => {
    try {
      const id = await users.findByIdAndDelete(req.params.id);
      if (!id) {
        return res.status(404).json(CreateError("User not found"));
      }
      return res.status(200).json(CreateSuccess("User deleted successfully", id));
    } catch (error) {
      return res.status(500).json(CreateError("Internal Server Error"));
    }
  }

