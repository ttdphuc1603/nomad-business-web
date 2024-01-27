const mongoose = require('mongoose');

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;

