const { validationResult } = require("express-validator");
const rideService = require("../service/ride.service");
const rideModel = require("../models/ride.model");
const userModel = require("../models/user.model"); // 🔥 Fix: Registering User Schema
const mapService = require("../service/maps.service");
const { sendMessageToSocketId } = require("../../socket");

/**
 * 1. Create New Ride
 * User side se hit hota hai. 
 * Nearby captains ko 'new-ride' event bhejta hai.
 */
module.exports.createRide = async (req, res) => {
    const { pickup, destination, vehicleType } = req.body;
    const user = req.user._id;

    try {
        // 1. Ride Create Karo
        const ride = await rideService.createRide({ user, pickup, destination, vehicleType });
        
        // User ko turant response bhej do
        res.status(201).json({ success: true, data: ride });

        // --- Yahan se Socket aur Location Logic Shuru hota hai ---
        try {
            const pickupCoordinates = await mapService.getAddressCoordinate(pickup);
            
            // 🔥 Testing ke liye radius 50km ya 5000km kar do agar "Found 0" aa raha hai
            const captainsInRadius = await mapService.getCaptainsInTheRadius(pickupCoordinates.lat, pickupCoordinates.lng, 50);

            // Ride ke saath User ka data populate karo (Popup ke liye zaroori hai)
            const rideWithUser = await rideModel.findOne({ _id: ride._id }).populate('user');

            console.log(`✅ System: Found ${captainsInRadius.length} captains for this ride.`);

            // 🔥 YE WALA CODE YAHAN JAYEGA
            captainsInRadius.map(captain => {
                console.log(`📡 Sending ride to captain: ${captain.fullname.firstname} (ID: ${captain._id})`);
                
                sendMessageToSocketId(captain._id.toString(), {
                    event: 'new-ride', 
                    data: rideWithUser
                });
            });

        } catch (err) { 
            console.log("❌ Socket Logic Error:", err.message); 
        }

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 2. Confirm Ride
 * Captain side se hit hota hai jab wo 'Accept' click karta hai.
 * User ko 'ride-confirmed' event bhejta hai.
 */
module.exports.confirmRide = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideService.confirmRide({ rideId, captain: req.captain });

        // 🔥 FIX: Notifying User via their Room ID
        sendMessageToSocketId(ride.user._id.toString(), {
            event: 'ride-confirmed',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * 3. Verify OTP & Start Ride
 * Captain OTP enter karke ride start karta hai.
 * User ko 'ride-started' event bhejta hai.
 */
module.exports.verifyOtp = async (req, res) => {
    const { rideId, otp } = req.body;
    try {
        const ride = await rideModel.findById(rideId).select("+otp").populate('user').populate('captain');
        
        if (!ride || ride.otp !== otp) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        ride.status = "ongoing";
        ride.otp = undefined; // Hide OTP after start
        await ride.save();

        // 🔥 FIX: Notify User via Room ID
        sendMessageToSocketId(ride.user._id.toString(), {
            event: 'ride-started',
            data: ride
        });

        res.status(200).json({ success: true, data: ride });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * 4. End Ride
 * Captain ride khatam karta hai.
 * User ko 'ride-ended' bhejta hai payment ke liye.
 */
module.exports.endRide = async (req, res) => {
    const { rideId } = req.body;
    try {
        const ride = await rideService.endRide({ rideId, captain: req.captain });

        // 🔥 FIX: Notify User via Room ID
        sendMessageToSocketId(ride.user._id.toString(), {
            event: 'ride-ended',
            data: ride
        });

        return res.status(200).json(ride);
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }
};

/**
 * 5. Get Fare Suggestions
 */
module.exports.getFare = async (req, res) => {
    const { pickup, destination } = req.query;
    try {
        const fareData = await rideService.getFare(pickup, destination);
        res.status(200).json({ success: true, data: fareData });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};