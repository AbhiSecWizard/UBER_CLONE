const express = require("express");
const router = express.Router();
const { body } = require('express-validator');
const authMiddleware = require("../middlewares/auth.middleware");
const rideController = require("../controllers/ride.controller");

router.post("/create", 
    authMiddleware.authUser, 
    rideController.createRide
);

router.post("/confirm", 
    authMiddleware.authCaptain, // Sirf Captain confirm kar sakta hai
    body("rideId").isString().isLength({ min: 24 }),
    rideController.confirmRide
);

router.post("/verify-otp", 
    authMiddleware.authCaptain, 
    body("rideId").isString().isLength({ min: 24 }),
    body("otp").isLength({ min: 4, max: 4 }),
    rideController.verifyOtp
);

router.post("/end-ride", 
    authMiddleware.authCaptain,
    body("rideId").isString().isLength({ min: 24 }),
    rideController.endRide
);


router.get("/get-fare", authMiddleware.authUser, rideController.getFare);

module.exports = router;