const { validationResult } = require("express-validator");
const rideService = require("../service/ride.service");
const rideModel = require("../models/ride.model")
// 🔥 Create Ride Controller
module.exports.createRide = async (req, res) => {
    const errors = validationResult(req);

    // ❌ validation error
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const { pickup, destination, vehicleType } = req.body;

        // 🔥 auth middleware se user milega
        const user = req.user?._id || req.body.userId; // fallback for testing

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated"
            });
        }
        const otpValue =
         rideService.getOtp(4);
        console.log("Generate Otp Testing",otpValue)
        // 🔥 create ride using service
        const ride = await rideService.createRide({
            user,
            pickup,
            destination,
            vehicleType,
            otp:otpValue
        });

        // ✅ success response
        res.status(201).json({
            success: true,
            message: "Ride created successfully",
            data: ride
        });

    } catch (error) {
        console.error("Create Ride Error:", error.message);

        res.status(500).json({
            success: false,
            message: error.message || "Internal server error"
        });
    }
};

module.exports.verifyOtp = async (req, res) => {
    try {
        const { rideId, otp } = req.body;

        if (!rideId || !otp) {
            return res.status(400).json({
                success: false,
                message: "Ride ID and OTP required"
            });
        }

        // 🔥 otp field hidden hai → select("+otp")
        const ride = await rideModel.findById(rideId).select("+otp");

        if (!ride) {
            return res.status(404).json({
                success: false,
                message: "Ride not found"
            });
        }

        // 🔥 match OTP
        if (ride.otp !== otp) {
            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // 🔥 correct → ride start
        ride.status = "ongoing";
        ride.otp = undefined; // OTP remove for security
        await ride.save();

        res.status(200).json({
            success: true,
            message: "OTP verified, ride started",
            data: ride
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports.getFare = async (req, res) => {
  try {
    // ✅ correct query params
    const { pickup, destination } = req.query;

    // 🔍 DEBUG (important)
    console.log("🔥 Query Data:", req.query);

    // ✅ validation
    if (!pickup || !destination) {
      return res.status(400).json({
        success: false,
        message: "Pickup and destination required",
      });
    }

    // 🔥 call service directly
    const fareData = await rideService.getFare(pickup, destination);

    res.status(200).json({
      success: true,
      data: fareData,
    });

  } catch (error) {
    console.error("Get Fare Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
