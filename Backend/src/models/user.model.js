const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    fullname: {
        firstname: {
            type: String,
            required: true,
            minlength: [3, "First Name Must Be at least 3 characters"]
        },
        lastname: {
            type: String,
            // required false hai taaki agar koi na daale toh crash na ho
            minlength: [3, "Last name Must be at least 3 characters"]
        }
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Accha rehta hai taaki email hamesha lowercase save ho
        minlength: [5, "Email must be at least 5 characters"]
    },
    password: {
        type: String,
        required: true,
        select: false, // Security ke liye best practice
    },
    socketId: {
        type: String // Socket.io connection store karne ke liye
    }
});

// Method: Token generate karne ke liye
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' }); // 24h is usually enough
    return token;
};

// Method: Password compare karne ke liye
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Static Method: Password hash karne ke liye
userSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;