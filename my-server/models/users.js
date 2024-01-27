const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    password: {
        type: String,
        required: true
        
    },
    avatarUrl: { type: String, 
        required: false },
    dateOfBirth: { type: Date,
     required: false }, 
    isAdmin: {
        type: Boolean,
        default: false
    },
    role: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Role"
    }
}, {
    timestamps: true
});

module.exports = mongoose.model("User", UserSchema);

