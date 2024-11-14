const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },

    email: {
        type: String,
        require: true,
        unique: true,
    },

    password: {
        type: String,
        require: true,
        min: 6,
    },

    description: {
        type: String,
        max: 50,
        default: "",
    },
    profilePicture: {
        type: String,
        default: "YOUR_DEFAULT_AVATAR_URL",
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
        default: "user",
    },
    gender: {
        type: String,
        enum: ["male", "female"],
    },
    jwtToken: {
        type: String,
    },
});

module.exports = mongoose.model("user", UserSchema);
