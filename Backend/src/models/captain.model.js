const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const captainSchema = new mongoose.Schema({
    fullname: {
        firstname: { type: String, required: true, minlength: [3, "Min 3 chars"] },
        lastname: { type: String, required: true, minlength: [3, "Min 3 chars"] }
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    socketId: { type: String },
    status: { type: String, enum: ['active', 'inactive'], default: "inactive" },
    vehicle: {
        color: { type: String, required: true },
        plate: { type: String, required: true },
        capacity: { type: Number, required: true },
        vehicleType: { type: String, required: true, enum: ['car', 'motorcycle', 'auto'] }
    },
    // 🔥 Standard GeoJSON Format Fix
    location: {
        type: { 
            type: String, 
            enum: ['Point'], 
            default: 'Point' 
        },
        coordinates: { 
            type: [Number], 
            default: [0, 0] // Registration ke time empty nahi rahega
        }
    }
});

// Radius search ke liye index
captainSchema.index({ location: '2dsphere' });

captainSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
};

captainSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

captainSchema.statics.hashPassword = async function (password) {
    return await bcrypt.hash(password, 10);
};

module.exports = mongoose.model('captain', captainSchema);